import { Entity, ManyToOne, Property } from '@mikro-orm/decorators/legacy';
import { Opt } from '@mikro-orm/sqlite';

import BaseEntity from '@/shared/entities/base.entity';

import UserEntity from '../user/user.entity';
import SessionRepository from './session.repository';

@Entity({ tableName: 'sessions', repository: () => SessionRepository })
class SessionEntity extends BaseEntity {
  @Property({ type: 'string', length: 60 })
  browser: string;

  @Property({ type: 'string', length: 60 })
  os: string;

  @Property({ type: 'string', length: 80, unique: true, index: true })
  token: string;

  @ManyToOne({ entity: () => UserEntity, lazy: true })
  user: UserEntity;

  @Property({ type: 'boolean', persist: false })
  isCurrent: boolean & Opt = false;

  @Property({ type: 'datetime' })
  expireAt: Date;
}

export default SessionEntity;
