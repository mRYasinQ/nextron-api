import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { UserTier } from '@/shared/constants/user-tier';
import BaseResponseDto from '@/shared/dtos/response.dto';
import { createBaseResponse, createDataResponse, createErrorResponse } from '@/shared/utils/create-response-dto';

import ProfileMessage from '../profile.message';

class ProfileData extends BaseResponseDto {
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
  @ApiProperty({ format: 'email', nullable: true })
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

class ProfileResponseDto extends createDataResponse(ProfileData, ProfileMessage.PROFILE_GET) {}
class UpdateProfileResponseDto extends createBaseResponse(ProfileMessage.PROFILE_UPDATED) {}

class ProfileEmailExistResponseDto extends createErrorResponse(ProfileMessage.EMAIL_EXIST, HttpStatus.CONFLICT) {}

export { ProfileResponseDto, UpdateProfileResponseDto, ProfileEmailExistResponseDto };
