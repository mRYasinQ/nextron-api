import { EntityRepository } from '@mikro-orm/sqlite';

import SessionEntity from './session.entity';

class SessionRepository extends EntityRepository<SessionEntity> {}

export default SessionRepository;
