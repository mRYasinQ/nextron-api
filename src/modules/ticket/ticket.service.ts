import { Injectable, NotFoundException } from '@nestjs/common';

import { EntityManager, type FilterQuery, wrap } from '@mikro-orm/sqlite';
import { Logger } from 'nestjs-pino';

import { getPaginationOptions, paginate } from '@/shared/utils/pagination';

import type { FindOneMethod } from '@/shared/types/service';

import StorageService from '../storage/storage.service';
import UserEntity from '../user/user.entity';
import UserService from '../user/user.service';
import type { CreateTicket, CreateTicketMessage, GetTicketMessagesQuery, GetTicketsQuery, UpdateTicket } from './dtos/ticket.dto';
import TicketEntity from './entities/ticket.entity';
import TicketMessageEntity from './entities/ticket-message.entity';
import TicketRepository from './repositories/ticket.repository';
import TicketMessageRepository from './repositories/ticket-message.repository';
import { TicketStatus } from './ticket.constant';
import TicketMessage from './ticket.message';

@Injectable()
class TicketService {
  constructor(
    private readonly em: EntityManager,
    private readonly ticketRepo: TicketRepository,
    private readonly ticketMessageRepo: TicketMessageRepository,
    private readonly userService: UserService,
    private readonly storageService: StorageService,
    private readonly logger: Logger,
  ) {}

  async findAll(query: GetTicketsQuery) {
    const { page, ...findOptions } = getPaginationOptions({ query });
    const where = this.buildWhereClause(query);

    const [data, total] = await this.ticketRepo.findAndCount(where, { ...findOptions, populate: ['creator'] });

    return paginate(data, total, page, findOptions.limit);
  }

  findOne: FindOneMethod<TicketEntity, FilterQuery<TicketEntity>> = (filter, options?) => {
    return this.ticketRepo.findOne(filter, options);
  };

  async getMessages(ticketId: number, query: GetTicketMessagesQuery, userId?: number) {
    const filter: FilterQuery<TicketEntity> = { id: ticketId };
    if (userId) filter.creator = userId;

    const ticket = await this.findOne(filter, { fields: ['id'] });
    if (!ticket) throw new NotFoundException(TicketMessage.NOT_FOUND);

    const { page, ...findOptions } = getPaginationOptions({ query });

    const [data, total] = await this.ticketMessageRepo.findAndCount({ ticket: ticketId }, { ...findOptions, populate: ['sender'] });

    return paginate(data, total, page, findOptions.limit);
  }

  async createAdminMessage(ticketId: number, adminId: number, data: CreateTicketMessage) {
    return this.em.transactional(async (em) => {
      const ticket = await em.findOne(TicketEntity, { id: ticketId }, { fields: ['id', 'status'] });
      if (!ticket) throw new NotFoundException(TicketMessage.NOT_FOUND);

      const newMessage = em.create(TicketMessageEntity, {
        ...data,
        ticket: em.getReference(TicketEntity, ticketId),
        sender: em.getReference(UserEntity, adminId),
      });

      const ticketStatus = ticket.status as TicketStatus;
      if (ticketStatus !== TicketStatus.ANSWERED) wrap(ticket).assign({ status: TicketStatus.ANSWERED });

      await em.flush();

      return newMessage;
    });
  }

  async createMessage(ticketId: number, senderId: number, data: CreateTicketMessage) {
    return this.em.transactional(async (em) => {
      const ticket = await em.findOne(TicketEntity, { id: ticketId, creator: senderId }, { fields: ['id', 'status'] });
      if (!ticket) throw new NotFoundException(TicketMessage.NOT_FOUND);

      const newMessage = em.create(TicketMessageEntity, {
        ...data,
        ticket: em.getReference(TicketEntity, ticketId),
        sender: em.getReference(UserEntity, senderId),
      });

      const ticketStatus = ticket.status as TicketStatus;
      if (ticketStatus !== TicketStatus.PENDING) wrap(ticket).assign({ status: TicketStatus.PENDING });

      await em.flush();

      return newMessage;
    });
  }

  async create(data: CreateTicket, senderId: number) {
    const { user_id, message, resource, ...ticketData } = data;

    let ticketCreatorId = user_id;

    if (user_id !== senderId) {
      const user = await this.userService.findOne({ id: user_id }, { fields: ['id'] });
      if (!user) throw new NotFoundException(TicketMessage.USER_NOT_FOUND);
      ticketCreatorId = user.id;
    }

    return this.em.transactional(async (em) => {
      const newTicket = em.create(TicketEntity, { ...ticketData, creator: em.getReference(UserEntity, ticketCreatorId) });

      em.create(TicketMessageEntity, {
        message,
        resource,
        ticket: newTicket,
        sender: em.getReference(UserEntity, senderId),
      });

      await em.flush();

      return newTicket;
    });
  }

  async update(filter: FilterQuery<TicketEntity>, data: UpdateTicket) {
    const ticket = await this.findOne(filter, { fields: ['id'] });
    if (!ticket) throw new NotFoundException(TicketMessage.NOT_FOUND);

    wrap(ticket).assign(data);
    await this.em.flush();

    return;
  }

  async delete(id: number) {
    const ticket = await this.findOne({ id }, { fields: ['id'] });
    if (!ticket) throw new NotFoundException(TicketMessage.NOT_FOUND);

    const messagesWithResources = await this.ticketMessageRepo.find({ ticket: id, resource: { $ne: null } }, { fields: ['resource'] });

    const resourceKeys = messagesWithResources.map((msg) => msg.resource).filter(Boolean) as string[];
    if (resourceKeys.length > 0) void this.deleteBackgroundResources(resourceKeys);

    await this.em.remove(ticket).flush();
    return;
  }

  async deleteMessage(ticketId: number, messageId: number) {
    const message = await this.ticketMessageRepo.findOne({ id: messageId, ticket: ticketId }, { fields: ['id', 'resource'] });
    if (!message) throw new NotFoundException(TicketMessage.MESSAGE_NOT_FOUND);

    if (message.resource) void this.deleteBackgroundResources([message.resource]);

    await this.em.remove(message).flush();
    return;
  }

  private async deleteBackgroundResources(keys: string[]) {
    for (const key of keys) {
      try {
        await this.storageService.deleteFile(key);
      } catch {
        this.logger.error(`Failed to delete storage resource with key: ${key}`);
      }
    }
  }

  private buildWhereClause(query: GetTicketsQuery) {
    const { user_id, search, status, priority } = query;

    const where: FilterQuery<TicketEntity> = {};

    if (user_id) where.creator = user_id;
    if (search) where.title = { $ilike: `%${search}%` };
    if (status !== undefined) where.status = status;
    if (priority !== undefined) where.priority = priority;

    return where;
  }
}

export default TicketService;
