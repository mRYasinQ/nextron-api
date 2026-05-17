import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiConflictResponse, ApiNotFoundResponse } from '@nestjs/swagger';

import ApiStandard from '@/shared/decorators/api-standard.decorator';

import { CreateUserDto, GetUsersQueryDto, UpdateUserDto } from './dtos/user.dto';
import {
  CreateUserAdminResponseDto,
  DeleteUserAdminResponseDto,
  EmailExistResponseDto,
  GetUserAdminResponseDto,
  GetUsersAdminResponseDto,
  NotFoundUserResponseDto,
  UpdateUserAdminResponseDto,
} from './dtos/user-response.dto';
import UserMessage from './user.message';
import UserService from './user.service';

@Controller('admin/user')
class UserAdminController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: UserMessage.USERS_GET,
    summary: 'Get users',
    type: GetUsersAdminResponseDto,
    requireAdmin: true,
  })
  getUsers(@Query() query: GetUsersQueryDto) {
    return this.userService.findAll(query);
  }

  @Get('/:id')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: UserMessage.USER_GET,
    summary: 'Get user',
    type: GetUserAdminResponseDto,
    requireAdmin: true,
  })
  @ApiNotFoundResponse({ type: NotFoundUserResponseDto })
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne({ id });
    if (!user) throw new NotFoundException(UserMessage.NOT_FOUND);

    return user;
  }

  @Post()
  @ApiStandard({
    status: HttpStatus.CREATED,
    successMessage: UserMessage.USER_CREATED,
    summary: 'Create user',
    type: CreateUserAdminResponseDto,
    requireAdmin: true,
  })
  @ApiConflictResponse({
    type: EmailExistResponseDto,
    examples: {
      EmailExist: {
        summary: 'Email exist',
        value: { status_code: HttpStatus.CONFLICT, error: UserMessage.EMAIL_EXIST },
      },
      PhoneNumberExist: {
        summary: 'Phone number exist',
        value: { status_code: HttpStatus.CONFLICT, error: UserMessage.PHONE_EXIST },
      },
    },
  })
  createUser(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Patch('/:id')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: UserMessage.USER_UPDATED,
    summary: 'Update user',
    type: UpdateUserAdminResponseDto,
    requireAdmin: true,
  })
  @ApiNotFoundResponse({ type: NotFoundUserResponseDto })
  @ApiConflictResponse({
    type: EmailExistResponseDto,
    examples: {
      EmailExist: {
        summary: 'Email exist',
        value: { status_code: HttpStatus.CONFLICT, error: UserMessage.EMAIL_EXIST },
      },
      PhoneNumberExist: {
        summary: 'Phone number exist',
        value: { status_code: HttpStatus.CONFLICT, error: UserMessage.PHONE_EXIST },
      },
    },
  })
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
    return this.userService.update(id, body);
  }

  @Delete('/:id')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: UserMessage.USER_DELETED,
    summary: 'Delete user',
    type: DeleteUserAdminResponseDto,
    requireAdmin: true,
  })
  @ApiNotFoundResponse({ type: NotFoundUserResponseDto })
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}

export default UserAdminController;
