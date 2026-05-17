import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import type { EntityData, FilterQuery, RequiredEntityData } from '@mikro-orm/sqlite';
import { EntityManager, wrap } from '@mikro-orm/sqlite';

import { toCamelCase } from '@/shared/utils/case-transformer';
import { getPaginationOptions, paginate } from '@/shared/utils/pagination';

import type { FindOneMethod } from '@/shared/types/service';

import PasswordProvider from '../common/providers/password.provider';
import type { CreateUser, GetUsersQuery, UpdateUser } from './dtos/user.dto';
import UserEntity from './user.entity';
import UserMessage from './user.message';
import UserRepository from './user.repository';

@Injectable()
class UserService {
  constructor(
    private readonly em: EntityManager,
    private readonly userRepo: UserRepository,
    private readonly passwordProvider: PasswordProvider,
  ) {}

  async findAll(query: GetUsersQuery) {
    const { page, ...findOptions } = getPaginationOptions({ query });
    const where = this.buildWhereClause(query);

    const [data, total] = await this.userRepo.findAndCount(where, { ...findOptions });

    return paginate(data, total, page, findOptions.limit);
  }

  findOne: FindOneMethod<UserEntity, FilterQuery<UserEntity>> = (filter, options?) => {
    return this.userRepo.findOne(filter, options);
  };

  async create(data: CreateUser) {
    const { email, phone_number, password } = data;

    const checkExistTask: Promise<boolean>[] = [
      this.checkUserExistByPhoneNumber(phone_number),
      email ? this.checkUserExistByEmail(email) : Promise.resolve(false),
    ];
    const [isExistPhone, isExistEmail] = await Promise.all(checkExistTask);

    if (isExistPhone) throw new ConflictException(UserMessage.PHONE_EXIST);
    if (isExistEmail) throw new ConflictException(UserMessage.EMAIL_EXIST);

    const hashedPassword = await this.passwordProvider.hash(password);

    const newUserData = toCamelCase<RequiredEntityData<UserEntity>>(data);
    const newUser = this.userRepo.create({ ...newUserData, password: hashedPassword });
    await this.em.flush();

    return newUser;
  }

  async update(id: number, data: UpdateUser) {
    const user = await this.findOne({ id }, { fields: ['id', 'email', 'phoneNumber', 'isActive'] });
    if (!user) throw new NotFoundException(UserMessage.NOT_FOUND);

    const { email, phone_number, password, is_phone_verified, is_email_verified } = data;
    const newUserData = toCamelCase<EntityData<UserEntity>>(data);

    const checkPhoneCondition = phone_number && user.phoneNumber !== phone_number;
    const checkEmailCondition = email && user.email !== email;

    const [isExistPhone, isExistEmail] = await Promise.all([
      checkPhoneCondition ? this.checkUserExistByPhoneNumber(phone_number) : Promise.resolve(false),
      checkEmailCondition ? this.checkUserExistByEmail(email) : Promise.resolve(false),
    ]);

    if (isExistPhone) throw new ConflictException(UserMessage.PHONE_EXIST);
    if (isExistEmail) throw new ConflictException(UserMessage.EMAIL_EXIST);

    if (checkPhoneCondition && is_phone_verified === undefined) newUserData.isPhoneVerified = false;
    if (checkEmailCondition && is_email_verified === undefined) newUserData.isEmailVerified = false;
    if (password) newUserData.password = await this.passwordProvider.hash(password);

    wrap(user).assign(newUserData);
    await this.em.flush();

    return;
  }

  async delete(id: number) {
    const count = await this.userRepo.nativeDelete({ id });
    if (!count) throw new NotFoundException(UserMessage.NOT_FOUND);

    return;
  }

  async checkUserExistByPhoneNumber(phoneNumber: string) {
    const user = await this.findOne({ phoneNumber }, { fields: ['id'] });
    return Boolean(user);
  }

  async checkUserExistByEmail(email: string) {
    const user = await this.findOne({ email }, { fields: ['id'] });
    return Boolean(user);
  }

  private buildWhereClause(query: GetUsersQuery) {
    const { search, is_active, is_admin, is_phone_verified, is_email_verified } = query;

    const where: FilterQuery<UserEntity> = {};

    if (search) {
      where.$or = [
        { firstName: { $ilike: `%${search}%` } },
        { lastName: { $ilike: `%${search}%` } },
        { email: { $ilike: `%${search}%` } },
        { phoneNumber: { $ilike: `%${search}%` } },
      ];
    }
    if (is_active !== undefined) where.isActive = is_active;
    if (is_admin !== undefined) where.isAdmin = is_admin;
    if (is_phone_verified !== undefined) where.isPhoneVerified = is_phone_verified;
    if (is_email_verified !== undefined) where.isEmailVerified = is_email_verified;

    return where;
  }
}

export default UserService;
