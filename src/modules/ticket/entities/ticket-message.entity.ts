import { Entity, ManyToOne, Property } from '@mikro-orm/decorators/legacy';

import UserEntity from '@/modules/user/user.entity';

import BaseEntity from '@/shared/entities/base.entity';

import TicketMessageRepository from '../repositories/ticket-message.repository';
import TicketEntity from './ticket.entity';

@Entity({ tableName: 'ticket_messages', repository: () => TicketMessageRepository })
class TicketMessageEntity extends BaseEntity {
  @Property({ type: 'text' })
  message: string;

  @Property({ type: 'string', nullable: true })
  resource: string | null = null;

  @ManyToOne({ entity: () => UserEntity })
  sender: UserEntity;

  @ManyToOne({ entity: () => TicketEntity, lazy: true })
  ticket: TicketEntity;
}

export default TicketMessageEntity;
