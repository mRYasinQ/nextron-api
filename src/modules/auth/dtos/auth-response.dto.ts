import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { createBaseResponse, createDataResponse, createErrorResponse } from '@/shared/utils/create-response-dto';

import AuthMessage from '../auth.message';

class LoginData {
  @Expose()
  @ApiProperty()
  phone_number: string;

  @Expose()
  @ApiProperty()
  token: string;
}

class SendOtpData {
  @Expose()
  @ApiProperty()
  phone_number: string;

  @Expose()
  @ApiProperty({ minLength: 5, maxLength: 5 })
  otp: string;
}

class SendOtpEmailData {
  @Expose()
  @ApiProperty({ format: 'email' })
  email: string;

  @Expose()
  @ApiProperty({ minLength: 5, maxLength: 5 })
  otp: string;
}

class VerifyOtpData {
  @Expose()
  @ApiProperty()
  phone_number: string;

  @Expose()
  @ApiProperty({ example: true })
  verified: boolean;
}

class VerifyPhoneNumberData {
  @Expose()
  @ApiProperty({ name: 'phone_number' })
  phoneNumber: string;

  @Expose()
  @ApiProperty({ name: 'is_phone_verified', example: true })
  isPhoneVerified: boolean;
}

class VerifyEmailData {
  @Expose()
  @ApiProperty({ format: 'email' })
  email: string;

  @Expose()
  @ApiProperty({ name: 'is_email_verified', example: true })
  isEmailVerified: boolean;
}

class LoginResponseDto extends createDataResponse(LoginData, AuthMessage.LOGIN_SUCCESS) {}
class RegisterResponseDto extends createDataResponse(LoginData, AuthMessage.REGISTER_SUCCESS, HttpStatus.CREATED) {}
class RecoverResponseDto extends createDataResponse(LoginData, AuthMessage.RECOVER_SUCCESS) {}

class VerifyPhoneNumberResponseDto extends createDataResponse(VerifyPhoneNumberData, AuthMessage.PHONE_VERIFIED_SUCCESS) {}
class VerifyEmailResponseDto extends createDataResponse(VerifyEmailData, AuthMessage.EMAIL_VERIFIED_SUCCESS) {}

class SendOtpResponseDto extends createDataResponse(SendOtpData, AuthMessage.SENT_OTP) {}
class SendOtpEmailResponseDto extends createDataResponse(SendOtpEmailData, AuthMessage.SENT_OTP) {}
class VerifyOtpResponseDto extends createDataResponse(VerifyOtpData, AuthMessage.VERIFIED_OTP) {}

class LogoutResponseDto extends createBaseResponse(AuthMessage.LOGOUT_SUCCESS) {}

class TooManyRequestOtpResponseDto extends createErrorResponse(AuthMessage.WAIT_BEFORE_NEW_OTP, HttpStatus.TOO_MANY_REQUESTS) {}

export {
  LoginResponseDto,
  RegisterResponseDto,
  RecoverResponseDto,
  VerifyPhoneNumberResponseDto,
  VerifyEmailResponseDto,
  SendOtpResponseDto,
  SendOtpEmailResponseDto,
  VerifyOtpResponseDto,
  LogoutResponseDto,
  TooManyRequestOtpResponseDto,
};
