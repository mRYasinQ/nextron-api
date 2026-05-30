import { Entity, Property } from '@mikro-orm/decorators/legacy';
import { Opt } from '@mikro-orm/sqlite';

import BaseEntity from '@/shared/entities/base.entity';

import AiRepository from './ai.repository';

@Entity({ tableName: 'ai_models', repository: () => AiRepository })
class AiEntity extends BaseEntity {
  @Property({ type: 'string' })
  name: string;

  @Property({ type: 'string' })
  model: string;

  @Property({ type: 'string' })
  provider: string;

  @Property({ type: 'string' })
  apiKey: string;

  @Property({ type: 'boolean', default: true })
  isActive: boolean & Opt = true;

  @Property({ type: 'boolean', default: false })
  isProOnly: boolean & Opt = false;

  @Property({ type: 'number' })
  tokenCredit: number;
}

export default AiEntity;
