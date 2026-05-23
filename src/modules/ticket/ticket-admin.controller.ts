import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { ApiNotFoundResponse } from '@nestjs/swagger';

import type { Request } from 'express';

import STORAGE_FOLDERS from '@/shared/constants/storage-folders';
import ApiStandard from '@/shared/decorators/api-standard.decorator';
import CurrentUserId from '@/shared/decorators/current-user-id.decorator';
import FileValidationPipe from '@/shared/pipes/file-validation.pipe';

import StorageService from '../storage/storage.service';
import { CreateTicketMessageDto, GetAdminTicketsQueryDto, GetTicketMessagesQueryDto, UpdateTicketDto } from './dtos/ticket.dto';
import {
  CreateTicketMessageResponseDto,
  DeleteTicketMessageResponseDto,
  DeleteTicketResponseDto,
  GetTicketMessagesResponseDto,
  GetTicketResponseDto,
  GetTicketsResponseDto,
  NotFoundMessageResponseDto,
  NotFoundTicketResponseDto,
  UpdateTicketResponseDto,
} from './dtos/ticket-response.dto';
import TicketMessage from './ticket.message';
import TicketService from './ticket.service';

@Controller('admin/ticket')
class TicketAdminController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly storageService: StorageService,
  ) {}

  @Get()
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: TicketMessage.TICKETS_GET,
    summary: 'Get all tickets',
    requireAdmin: true,
    type: GetTicketsResponseDto,
  })
  getlAllTickets(@Query() query: GetAdminTicketsQueryDto) {
    return this.ticketService.findAll(query);
  }

  @Get('/:id')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: TicketMessage.TICKET_GET,
    summary: 'Get ticket',
    requireAdmin: true,
    type: GetTicketResponseDto,
  })
  @ApiNotFoundResponse({ type: NotFoundTicketResponseDto })
  async getTicket(@Param('id', ParseIntPipe) id: number) {
    const ticket = await this.ticketService.findOne({ id }, { populate: ['creator'] });
    if (!ticket) throw new NotFoundException(TicketMessage.NOT_FOUND);

    return ticket;
  }

  @Get('/:id/messages')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: TicketMessage.MESSAGES_GET,
    summary: 'Get ticket messages',
    requireAdmin: true,
    type: GetTicketMessagesResponseDto,
  })
  @ApiNotFoundResponse({ type: NotFoundTicketResponseDto })
  getTicketMessages(@Param('id', ParseIntPipe) id: number, @Query() query: GetTicketMessagesQueryDto) {
    return this.ticketService.getMessages(id, query);
  }

  @Post('/:id/messages')
  @ApiStandard({
    status: HttpStatus.CREATED,
    successMessage: TicketMessage.MESSAGE_CREATED,
    summary: 'Create ticket message',
    requireAdmin: true,
    type: CreateTicketMessageResponseDto,
    mimeTypes: ['multipart/form-data'],
    file: { name: 'resource' },
  })
  @ApiNotFoundResponse({ type: NotFoundTicketResponseDto })
  async createTicketMessage(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateTicketMessageDto,
    @CurrentUserId() adminId: number,
    @UploadedFile(new FileValidationPipe({ allowedTypes: ['image/png', 'image/jpeg', 'image/webp', 'application/pdf', 'application/zip'] }))
    file?: Express.Multer.File,
  ) {
    if (file) {
      const fileKey = await this.storageService.uploadFile(file, STORAGE_FOLDERS.TICKETS);
      req.uploadedFileKey = fileKey;
      body.resource = fileKey;
    }
    return this.ticketService.createAdminMessage(id, adminId, body);
  }

  @Patch('/:id')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: TicketMessage.TICKET_UPDATED,
    summary: 'Update ticket',
    requireAdmin: true,
    type: UpdateTicketResponseDto,
  })
  @ApiNotFoundResponse({ type: NotFoundTicketResponseDto })
  updateTicket(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTicketDto) {
    return this.ticketService.update({ id }, body);
  }

  @Delete('/:id')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: TicketMessage.TICKET_DELETED,
    summary: 'Delete ticket',
    requireAdmin: true,
    type: DeleteTicketResponseDto,
  })
  @ApiNotFoundResponse({ type: NotFoundTicketResponseDto })
  deleteTicket(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.delete(id);
  }

  @Delete('/:id/messages/:messageId')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: TicketMessage.MESSAGE_DELETED,
    summary: 'Delete ticket message',
    requireAdmin: true,
    type: DeleteTicketMessageResponseDto,
  })
  @ApiNotFoundResponse({ type: NotFoundMessageResponseDto })
  deleteTicketMessage(@Param('id', ParseIntPipe) id: number, @Param('messageId', ParseIntPipe) messageId: number) {
    return this.ticketService.deleteMessage(id, messageId);
  }
}

export default TicketAdminController;
