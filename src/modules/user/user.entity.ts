import { Entity, Enum, Property } from '@mikro-orm/decorators/legacy';
import { Opt } from '@mikro-orm/sqlite';

import { UserTier } from '@/shared/constants/user-tier';
import BaseEntity from '@/shared/entities/base.entity';

import UserRepository from './user.repository';

@Entity({ tableName: 'users', repository: () => UserRepository })
class UserEntity extends BaseEntity {
  @Property({ type: 'string', length: 30, nullable: true })
  firstName: string | null = null;

  @Property({ type: 'string', length: 30, nullable: true })
  lastName: string | null = null;

  @Property({ type: 'string', length: 25, unique: true })
  phoneNumber: string;

  @Property({ type: 'string', unique: true, nullable: true })
  email: string | null = null;

  @Property({ type: 'boolean' })
  isActive: boolean & Opt = true;

  @Property({ type: 'boolean' })
  isAdmin: boolean & Opt = false;

  @Property({ type: 'boolean' })
  isPhoneVerified: boolean & Opt = false;

  @Property({ type: 'boolean' })
  isEmailVerified: boolean & Opt = false;

  @Property({ type: 'string' })
  password: string;

  @Property({ type: 'number', default: 0 })
  creditBalance: number & Opt = 0;

  @Enum(() => UserTier)
  tier: UserTier & Opt = UserTier.FREE;

  @Property({ type: 'date', nullable: true })
  tierExpireAt: Date | null = null;
}

export default UserEntity;
