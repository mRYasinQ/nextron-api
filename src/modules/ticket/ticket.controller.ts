import { Body, Controller, Get, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Query, Req, UploadedFile } from '@nestjs/common';
import { ApiNotFoundResponse } from '@nestjs/swagger';

import type { Request } from 'express';

import STORAGE_FOLDERS from '@/shared/constants/storage-folders';
import ApiStandard from '@/shared/decorators/api-standard.decorator';
import CurrentUserId from '@/shared/decorators/current-user-id.decorator';
import FileValidationPipe from '@/shared/pipes/file-validation.pipe';

import StorageService from '../storage/storage.service';
import { NotFoundUserResponseDto } from '../user/dtos/user-response.dto';
import { CreateTicketDto, GetTicketsQueryDto } from './dtos/ticket.dto';
import {
  CreateTicketResponseDto,
  GetTicketResponseDto,
  GetTicketsResponseDto,
  NotFoundTicketResponseDto,
  UpdateTicketResponseDto,
} from './dtos/ticket-response.dto';
import { TicketStatus } from './ticket.constant';
import TicketMessage from './ticket.message';
import TicketService from './ticket.service';

@Controller('ticket')
class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly storageService: StorageService,
  ) {}

  @Get()
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: TicketMessage.TICKETS_GET,
    summary: 'Get tickets',
    type: GetTicketsResponseDto,
    secure: 'required',
  })
  getUserTickets(@Query() query: GetTicketsQueryDto, @CurrentUserId() userId: number) {
    return this.ticketService.findAllTicketUser(userId, query);
  }

  @Get('/:id')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: TicketMessage.TICKET_GET,
    summary: 'Get ticket',
    type: GetTicketResponseDto,
    secure: 'required',
  })
  @ApiNotFoundResponse({ type: NotFoundUserResponseDto })
  async getUserTicket(@Param('id', ParseIntPipe) id: number, @CurrentUserId() userId: number) {
    const ticket = await this.ticketService.findOne({ id, creator: userId }, { populate: ['creator'] });
    if (!ticket) throw new NotFoundException(TicketMessage.NOT_FOUND);

    return ticket;
  }

  @Post()
  @ApiStandard({
    status: HttpStatus.CREATED,
    successMessage: TicketMessage.TICKET_CREATED,
    summary: 'Create ticket',
    type: CreateTicketResponseDto,
    mimeTypes: ['multipart/form-data'],
    secure: 'required',
    file: { name: 'resource' },
  })
  async createTicket(
    @Req() req: Request,
    @Body() body: CreateTicketDto,
    @CurrentUserId() userId: number,
    @UploadedFile(new FileValidationPipe({ allowedTypes: ['image/png', 'image/jpeg', 'image/webp', 'application/pdf', 'application/zip'] }))
    file?: Express.Multer.File,
  ) {
    if (file) {
      const fileKey = await this.storageService.uploadFile(file, STORAGE_FOLDERS.TICKETS);
      req.uploadedFileKey = fileKey;
      body.resource = fileKey;
    }
    const reuslt = await this.ticketService.create({ ...body, user_id: userId }, userId);

    return reuslt;
  }

  @Post('/:id/close')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: TicketMessage.TICKET_UPDATED,
    summary: 'Close ticket',
    type: UpdateTicketResponseDto,
    secure: 'required',
  })
  @ApiNotFoundResponse({ type: NotFoundTicketResponseDto })
  closeTicket(@Param('id', ParseIntPipe) id: number, @CurrentUserId() userId: number) {
    return this.ticketService.update({ id, creator: userId }, { status: TicketStatus.CLOSED });
  }
}

export default TicketController;
