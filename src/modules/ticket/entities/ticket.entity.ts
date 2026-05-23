import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/decorators/legacy';
import { Opt } from '@mikro-orm/sqlite';

import UserEntity from '@/modules/user/user.entity';

import BaseEntity from '@/shared/entities/base.entity';

import TicketRepository from '../repositories/ticket.repository';
import { TicketPriority, TicketStatus } from '../ticket.constant';

@Entity({ tableName: 'tickets', repository: () => TicketRepository })
class TicketEntity extends BaseEntity {
  @Property({ type: 'string', length: 60 })
  title: string;

  @Enum(() => TicketStatus)
  status: TicketStatus & Opt = TicketStatus.OPEN;

  @Enum(() => TicketPriority)
  priority: TicketPriority & Opt = TicketPriority.MEDIUM;

  @ManyToOne({ entity: () => UserEntity, lazy: true, deleteRule: 'cascade' })
  creator: UserEntity;
}

export default TicketEntity;
