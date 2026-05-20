import { Injectable, NotFoundException } from '@nestjs/common';

import { EntityManager, type FilterQuery, wrap } from '@mikro-orm/sqlite';

import { getPaginationOptions, paginate } from '@/shared/utils/pagination';

import type { FindOneMethod } from '@/shared/types/service';

import UserEntity from '../user/user.entity';
import UserService from '../user/user.service';
import type { CreateTicket, GetTicketsQuery, UpdateTicket } from './dtos/ticket.dto';
import TicketEntity from './entities/ticket.entity';
import TicketMessageEntity from './entities/ticket-message.entity';
import TicketRepository from './repositories/ticket.repository';
import TicketMessageRepository from './repositories/ticket-message.repository';
import TicketMessage from './ticket.message';

@Injectable()
class TicketService {
  constructor(
    private readonly em: EntityManager,
    private readonly ticketRepo: TicketRepository,
    private readonly ticketMessageRepo: TicketMessageRepository,
    private readonly userService: UserService,
  ) {}

  async findAllTicketUser(userId: number, query: GetTicketsQuery) {
    const { page, ...findOptions } = getPaginationOptions({ query });
    const where = this.buildWhereClauseTicketsUser(userId, query);

    const [data, total] = await this.ticketRepo.findAndCount(where, { ...findOptions, populate: ['creator'] });

    return paginate(data, total, page, findOptions.limit);
  }

  findOne: FindOneMethod<TicketEntity, FilterQuery<TicketEntity>> = (filter, options?) => {
    return this.ticketRepo.findOne(filter, options);
  };

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
    const count = await this.ticketRepo.nativeDelete({ id });
    if (!count) throw new NotFoundException(TicketMessage.NOT_FOUND);
    return;
  }

  private buildWhereClauseTicketsUser(userId: number, query: GetTicketsQuery) {
    const { search, status, priority } = query;

    const where: FilterQuery<TicketEntity> = { creator: userId };

    if (search) where.title = { $ilike: `%${search}%` };
    if (status !== undefined) where.status = status;
    if (priority !== undefined) where.priority = priority;

    return where;
  }
}

export default TicketService;
