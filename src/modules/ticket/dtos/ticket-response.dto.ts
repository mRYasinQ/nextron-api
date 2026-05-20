import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import ToStorageUrl from '@/shared/decorators/storage-url.decorator';
import BaseResponseDto from '@/shared/dtos/response.dto';
import { createBaseResponse, createDataResponse, createErrorResponse, createPaginatedResponse } from '@/shared/utils/create-response-dto';

import { TicketPriority, TicketStatus } from '../ticket.constant';
import TicketMessage from '../ticket.message';

class UserData extends BaseResponseDto {
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
}

class TicketData extends BaseResponseDto {
  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty({ enum: TicketStatus })
  status: string;

  @Expose()
  @ApiProperty({ enum: TicketPriority })
  priority: string;

  @Expose()
  @ApiProperty({ type: UserData })
  creator: UserData;
}

class TicketMessageData extends BaseResponseDto {
  @Expose()
  @ApiProperty()
  message: string;

  @Expose()
  @ApiProperty({ nullable: true })
  @ToStorageUrl()
  resource: string;

  @Expose()
  @ApiProperty({ type: UserData })
  sender: UserData;
}

class GetTicketsResponseDto extends createPaginatedResponse(TicketData, TicketMessage.TICKETS_GET) {}
class GetTicketResponseDto extends createDataResponse(TicketData, TicketMessage.TICKETS_GET) {}
class CreateTicketResponseDto extends createBaseResponse(TicketMessage.TICKET_CREATED, HttpStatus.CREATED) {}
class UpdateTicketResponseDto extends createBaseResponse(TicketMessage.TICKET_UPDATED) {}

class GetTicketMessagesResponseDto extends createPaginatedResponse(TicketMessageData, TicketMessage.MESSAGES_GET) {}
class CreateTicketMessageResponseDto extends createBaseResponse(TicketMessage.MESSAGE_CREATED, HttpStatus.CREATED) {}

class NotFoundTicketResponseDto extends createErrorResponse(TicketMessage.NOT_FOUND, HttpStatus.NOT_FOUND) {}

export {
  GetTicketsResponseDto,
  GetTicketResponseDto,
  CreateTicketResponseDto,
  UpdateTicketResponseDto,
  GetTicketMessagesResponseDto,
  CreateTicketMessageResponseDto,
  NotFoundTicketResponseDto,
};
