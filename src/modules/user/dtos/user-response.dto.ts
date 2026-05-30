import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { UserTier } from '@/shared/constants/user-tier';
import BaseResponseDto from '@/shared/dtos/response.dto';
import { createBaseResponse, createDataResponse, createErrorResponse, createPaginatedResponse } from '@/shared/utils/create-response-dto';

import UserMessage from '../user.message';

class UserAdminData extends BaseResponseDto {
  @Expose()
  @ApiProperty({ name: 'first_name', nullable: true })
  firstName: string;

  @Expose()
  @ApiProperty({ name: 'last_name', nullable: true })
  lastName: string;

  @Expose()
  @ApiProperty({ name: 'phone_number' })
  phoneNumber: string;

  @Expose()
  @ApiProperty({ format: 'email' })
  email: string;

  @Expose()
  @ApiProperty({ name: 'is_active' })
  isActive: boolean;

  @Expose()
  @ApiProperty({ name: 'is_admin' })
  isAdmin: boolean;

  @Expose()
  @ApiProperty({ name: 'is_phone_verified' })
  isPhoneVerified: boolean;

  @Expose()
  @ApiProperty({ name: 'is_email_verified' })
  isEmailVerified: boolean;

  @Expose()
  @ApiProperty({ name: 'credit_balance' })
  creditBalance: number;

  @Expose()
  @ApiProperty({ enum: UserTier })
  tier: UserTier;

  @Expose()
  @ApiProperty({ name: 'tier_expire_at', format: 'date-time', nullable: true })
  tierExpireAt: Date;
}

class GetUsersAdminResponseDto extends createPaginatedResponse(UserAdminData, UserMessage.USERS_GET) {}
class GetUserAdminResponseDto extends createDataResponse(UserAdminData, UserMessage.USER_GET) {}
class CreateUserAdminResponseDto extends createBaseResponse(UserMessage.USER_CREATED, HttpStatus.CREATED) {}
class UpdateUserAdminResponseDto extends createBaseResponse(UserMessage.USER_UPDATED) {}
class DeleteUserAdminResponseDto extends createBaseResponse(UserMessage.USER_DELETED) {}

class NotFoundUserResponseDto extends createErrorResponse(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND) {}
class EmailExistResponseDto extends createErrorResponse(UserMessage.EMAIL_EXIST, HttpStatus.CONFLICT) {}
class PhoneNumberExistResponseDto extends createErrorResponse(UserMessage.PHONE_EXIST, HttpStatus.CONFLICT) {}

export {
  GetUsersAdminResponseDto,
  GetUserAdminResponseDto,
  CreateUserAdminResponseDto,
  UpdateUserAdminResponseDto,
  DeleteUserAdminResponseDto,
  NotFoundUserResponseDto,
  EmailExistResponseDto,
  PhoneNumberExistResponseDto,
};
