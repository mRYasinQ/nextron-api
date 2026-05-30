import { EntityRepository } from '@mikro-orm/sqlite';

import AiEntity from './ai.entity';

class AiRepository extends EntityRepository<AiEntity> {}

export default AiRepository;
