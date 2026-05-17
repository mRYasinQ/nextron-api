import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import CommonMessage from '@/shared/constants/common-message';
import type { UserAgentResult } from '@/shared/decorators/user-agent.decorator';
import type { EnvConfig } from '@/shared/schemas/env.schema';
import formatMessage from '@/shared/utils/format-message';
import { generateOtp, generateRandomBytes } from '@/shared/utils/random';

import PasswordProvider from '../common/providers/password.provider';
import SessionService from '../session/session.service';
import UserService from '../user/user.service';
import AuthMessage from './auth.message';
import type { Login, Recover, Register, SendOtp, VerifyIdentityOtp, VerifyOtp } from './dtos/auth.dto';
import type { OtpPayload } from './interfaces/otp.interface';

@Injectable()
class AuthService {
  private otpExpire: number;
  private otpCache: number;

  private readonly prefixRegister = 'register';
  private readonly prefixRecover = 'recover';
  private readonly prefixVerifyEmail = 'verify_email';
  private readonly prefixVerifyPhone = 'verify_phone';

  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly passwordProvider: PasswordProvider,
  ) {
    this.otpExpire = this.config.getOrThrow<EnvConfig['OTP_EXPIRE']>('time.otp.expire');
    this.otpCache = this.config.getOrThrow<EnvConfig['OTP_CACHE']>('time.otp.cache');
  }

  async login(data: Login, agent: UserAgentResult) {
    const { phone_number, password } = data;

    const user = await this.userService.findOne({ phoneNumber: phone_number }, { fields: ['id', 'password', 'isActive'] });
    if (!user) throw new BadRequestException(AuthMessage.CREDENTIALS_INCORRECT);

    const { password: hashedPassword, isActive } = user;

    const isPasswordValid = await this.passwordProvider.compare(password, hashedPassword);
    if (!isPasswordValid) throw new BadRequestException(AuthMessage.CREDENTIALS_INCORRECT);

    if (!isActive) throw new BadRequestException(CommonMessage.USER_INACTIVE);

    const token = await this.createToken(user.id, agent);

    return { phone_number, token };
  }

  async register(data: Register, agent: UserAgentResult) {
    const { phone_number, otp, password } = data;

    const key = `${this.prefixRegister}:${phone_number}`;

    const otpData = await this.cacheManager.get<OtpPayload>(key);
    if (!otpData || !otpData.verified || otpData.otp !== otp) throw new BadRequestException(AuthMessage.INVALID_OTP);

    await this.cacheManager.del(key);

    const user = await this.userService.create({ phone_number, password, is_phone_verified: true });

    const token = await this.createToken(user.id, agent);

    return { phone_number, token };
  }

  async sendRegisterOtp(data: SendOtp) {
    const { phone_number } = data;

    const isUserExist = await this.userService.checkUserExistByPhoneNumber(phone_number);
    if (isUserExist) throw new BadRequestException(AuthMessage.PHONE_ALREADY_ASSOCIATED);

    const key = `${this.prefixRegister}:${phone_number}`;
    const otp = await this.generateAndCacheOtp(key, this.otpExpire);

    return { phone_number, otp };
  }

  async verifyRegisterOtp(data: VerifyOtp) {
    const { phone_number, otp } = data;

    const key = `${this.prefixRegister}:${phone_number}`;
    await this.markOtpAsVerified(key, otp);

    return { phone_number, verified: true };
  }

  async recover(data: Recover, agent: UserAgentResult) {
    const { phone_number, otp, password } = data;

    const user = await this.userService.findOne({ phoneNumber: phone_number }, { fields: ['id'] });
    if (!user) throw new BadRequestException(AuthMessage.PHONE_INCORRECT);

    const key = `${this.prefixRecover}:${phone_number}`;

    const otpData = await this.cacheManager.get<OtpPayload>(key);
    if (!otpData || !otpData.verified || otpData.otp !== otp) throw new BadRequestException(AuthMessage.INVALID_OTP);

    await this.cacheManager.del(key);

    await this.userService.update(user.id, { password, is_phone_verified: true });

    const token = await this.createToken(user.id, agent);

    return { phone_number, token };
  }

  async sendRecoverOtp(data: SendOtp) {
    const { phone_number } = data;

    const isUserExist = await this.userService.checkUserExistByPhoneNumber(phone_number);
    if (!isUserExist) throw new BadRequestException(AuthMessage.PHONE_INCORRECT);

    const key = `${this.prefixRecover}:${phone_number}`;
    const otp = await this.generateAndCacheOtp(key, this.otpExpire);

    return { phone_number, otp };
  }

  async verifyRecoverOtp(data: VerifyOtp) {
    const { phone_number, otp } = data;

    const key = `${this.prefixRecover}:${phone_number}`;
    await this.markOtpAsVerified(key, otp);

    return { phone_number, verified: true };
  }

  async sendVerifyPhoneNumberOtp(userId: number) {
    const user = await this.userService.findOne({ id: userId }, { fields: ['phoneNumber', 'isPhoneVerified'] });
    if (!user) throw new UnauthorizedException(CommonMessage.AUTHENTICATION_REQUIRED);

    const { phoneNumber, isPhoneVerified } = user;

    if (isPhoneVerified) throw new BadRequestException(AuthMessage.PHONE_VERIFIED);

    const key = `${this.prefixVerifyPhone}:${phoneNumber}`;
    const otp = await this.generateAndCacheOtp(key, this.otpExpire);

    return { phone_number: phoneNumber, otp };
  }

  async verifyPhoneNumber(userId: number, data: VerifyIdentityOtp) {
    const user = await this.userService.findOne({ id: userId }, { fields: ['phoneNumber'] });
    if (!user) throw new UnauthorizedException(CommonMessage.AUTHENTICATION_REQUIRED);

    const { phoneNumber } = user;

    const key = `${this.prefixVerifyPhone}:${phoneNumber}`;

    const { otp } = data;

    const otpData = await this.cacheManager.get<OtpPayload>(key);
    if (!otpData || otpData.otp !== otp) throw new BadRequestException(AuthMessage.INVALID_OTP);

    await this.cacheManager.del(key);

    await this.userService.update(userId, { is_phone_verified: true });

    return { phoneNumber, isPhoneVerified: true };
  }

  async sendVerifyEmailOtp(userId: number) {
    const user = await this.userService.findOne({ id: userId }, { fields: ['email', 'isEmailVerified'] });
    if (!user) throw new UnauthorizedException(CommonMessage.AUTHENTICATION_REQUIRED);

    const { email, isEmailVerified } = user;

    if (isEmailVerified) throw new BadRequestException(AuthMessage.EMAIL_VERIFIED);

    const key = `${this.prefixVerifyEmail}:${email}`;
    const otp = await this.generateAndCacheOtp(key, this.otpExpire);

    return { email, otp };
  }

  async verifyEmail(userId: number, data: VerifyIdentityOtp) {
    const user = await this.userService.findOne({ id: userId }, { fields: ['email'] });
    if (!user) throw new UnauthorizedException(CommonMessage.AUTHENTICATION_REQUIRED);

    const { email } = user;

    const key = `${this.prefixVerifyEmail}:${email}`;

    const { otp } = data;

    const otpData = await this.cacheManager.get<OtpPayload>(key);
    if (!otpData || otpData.otp !== otp) throw new BadRequestException(AuthMessage.INVALID_OTP);

    await this.cacheManager.del(key);

    await this.userService.update(userId, { is_email_verified: true });

    return { email, isEmailVerified: true };
  }

  async logout(sessionId: number) {
    await this.sessionService.deleteById(sessionId);
    return;
  }

  async validateToken(token: string) {
    const session = await this.sessionService.findOne(
      { token, expireAt: { $gt: new Date() } },
      { fields: ['user.id', 'user.isAdmin', '*'] },
    );
    if (!session) throw new UnauthorizedException(CommonMessage.AUTHENTICATION_REQUIRED);

    return session;
  }

  private async generateAndCacheOtp(key: string, expireTime: number) {
    const otpExist = await this.cacheManager.get<OtpPayload>(key);
    if (otpExist) {
      const remainingTtl = Math.ceil((otpExist.expiresAt - Date.now()) / 1000);
      if (remainingTtl > 0 && !otpExist.verified) {
        throw new HttpException(formatMessage(AuthMessage.WAIT_BEFORE_NEW_OTP, { time: remainingTtl }), HttpStatus.TOO_MANY_REQUESTS);
      }
    }

    const otp = String(generateOtp());
    const expiresAt = Date.now() + expireTime;
    const payload: OtpPayload = { otp, verified: false, expiresAt };

    await this.cacheManager.set(key, payload, expireTime);

    return otp;
  }

  private async markOtpAsVerified(key: string, otp: string) {
    const otpData = await this.cacheManager.get<OtpPayload>(key);
    if (!otpData) throw new BadRequestException(AuthMessage.INVALID_OTP);

    if (otpData.verified) throw new BadRequestException(AuthMessage.OTP_ALREADY_VERIFIED);
    if (otpData.otp !== otp) throw new BadRequestException(AuthMessage.INVALID_OTP);

    const expiresAt = Date.now() + this.otpCache;
    const payload: OtpPayload = { otp, verified: true, expiresAt };

    await this.cacheManager.set(key, payload, this.otpCache);
  }

  private async createToken(userId: number, agent: UserAgentResult) {
    const { browser, os } = agent;

    const token = generateRandomBytes();

    const tokenExpire = this.config.getOrThrow<EnvConfig['SESSION_EXPIRE']>('time.session.expire');
    const tokenExpireMs = Date.now() + tokenExpire;
    const expireAt = new Date(tokenExpireMs);

    await this.sessionService.create({ token, user_id: userId, browser, os, expire_at: expireAt });

    return token;
  }
}

export default AuthService;
