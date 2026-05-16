import { Injectable } from '@nestjs/common';

import type { FilterQuery, RequiredEntityData } from '@mikro-orm/sqlite';
import { EntityManager } from '@mikro-orm/sqlite';

import { toCamelCase } from '@/shared/utils/case-transformer';

import type { FindOneMethod } from '@/shared/types/service';

import UserEntity from '../user/user.entity';
import type { CreateSession } from './dtos/session.dto';
import SessionEntity from './session.entity';
import SessionRepository from './session.repository';

@Injectable()
class SessionService {
  constructor(
    private readonly em: EntityManager,
    private readonly sessionRepo: SessionRepository,
  ) {}

  findOne: FindOneMethod<SessionEntity, FilterQuery<SessionEntity>> = (filter, options?) => {
    return this.sessionRepo.findOne(filter, options);
  };

  async create(data: CreateSession) {
    const user = this.em.getReference(UserEntity, data.user_id);

    const newSessionData = toCamelCase<RequiredEntityData<SessionEntity>>(data);
    const newSession = this.sessionRepo.create({ ...newSessionData, user });

    await this.em.flush();

    return newSession;
  }

  deleteById(id: number) {
    return this.sessionRepo.nativeDelete({ id });
  }

  deleteByUserId(userId: number) {
    return this.sessionRepo.nativeDelete({ user: userId });
  }
}

export default SessionService;
