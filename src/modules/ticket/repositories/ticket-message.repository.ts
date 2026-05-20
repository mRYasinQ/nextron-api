import { EntityRepository } from '@mikro-orm/sqlite';

import TicketMessageEntity from '../entities/ticket-message.entity';

class TicketMessageRepository extends EntityRepository<TicketMessageEntity> {}

export default TicketMessageRepository;
