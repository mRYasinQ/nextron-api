import { EntityRepository } from '@mikro-orm/sqlite';

import TicketEntity from '../entities/ticket.entity';

class TicketRepository extends EntityRepository<TicketEntity> {}

export default TicketRepository;
