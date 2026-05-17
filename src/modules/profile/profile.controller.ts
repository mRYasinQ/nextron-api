import { Body, Controller, Get, HttpStatus, Patch } from '@nestjs/common';
import { ApiConflictResponse } from '@nestjs/swagger';

import ApiStandard from '@/shared/decorators/api-standard.decorator';
import CurrentUserId from '@/shared/decorators/current-user-id.decorator';

import UserService from '../user/user.service';
import { UpdateProfileDto } from './dtos/profile.dto';
import { ProfileEmailExistResponseDto, ProfileResponseDto, UpdateProfileResponseDto } from './dtos/profile-response.dto';
import ProfileMessage from './profile.message';

@Controller('profile')
class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: ProfileMessage.PROFILE_GET,
    summary: 'Get your profile',
    type: ProfileResponseDto,
    secure: 'required',
  })
  getProfile(@CurrentUserId() userId: number) {
    return this.userService.findOne({ id: userId });
  }

  @Patch()
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: ProfileMessage.PROFILE_UPDATED,
    summary: 'Update your profile',
    type: UpdateProfileResponseDto,
    secure: 'required',
  })
  @ApiConflictResponse({
    type: ProfileEmailExistResponseDto,
    examples: {
      EmailExist: {
        summary: 'Email exist',
        value: { status_code: HttpStatus.CONFLICT, error: ProfileMessage.EMAIL_EXIST },
      },
      PhoneNumberExist: {
        summary: 'Phone number exist',
        value: { status_code: HttpStatus.CONFLICT, error: ProfileMessage.PHONE_EXIST },
      },
    },
  })
  updateProfile(@Body() body: UpdateProfileDto, @CurrentUserId() userId: number) {
    return this.userService.update(userId, body);
  }
}

export default ProfileController;
