import { Injectable, NotFoundException } from '@nestjs/common';

import type { FilterQuery, RequiredEntityData } from '@mikro-orm/sqlite';
import { EntityManager } from '@mikro-orm/sqlite';

import { toCamelCase } from '@/shared/utils/case-transformer';
import { getPaginationOptions, paginate } from '@/shared/utils/pagination';

import type { FindOneMethod } from '@/shared/types/service';

import UserEntity from '../user/user.entity';
import type { ClearSessions, CreateSession, GetSessionsQuery } from './dtos/session.dto';
import SessionEntity from './session.entity';
import SessionMessage from './session.message';
import SessionRepository from './session.repository';

@Injectable()
class SessionService {
  constructor(
    private readonly em: EntityManager,
    private readonly sessionRepo: SessionRepository,
  ) {}

  async findAllUserSession(query: GetSessionsQuery, userId: number, currentSessionId: number) {
    const { page, ...findOptions } = getPaginationOptions({ query, isOptional: true });

    const where: FilterQuery<SessionEntity> = { user: { $eq: userId } };
    const [data, total] = await this.sessionRepo.findAndCount(where, { ...findOptions, exclude: ['token', 'user'] });
    data.forEach((session) => (session.isCurrent = session.id === currentSessionId));

    return paginate(data, total, page, findOptions.limit);
  }

  async findOneUserSession(id: number, userId: number, currentSessionId: number) {
    const session = await this.sessionRepo.findOne({ id, user: userId }, { exclude: ['token', 'user'] });
    if (!session) throw new NotFoundException(SessionMessage.NOT_FOUND);

    session.isCurrent = session.id === currentSessionId;

    return session;
  }

  async deleteUserSession(id: number, userId: number) {
    const deleteCount = await this.sessionRepo.nativeDelete({ id, user: userId });
    if (!deleteCount) throw new NotFoundException(SessionMessage.NOT_FOUND);

    return;
  }

  async clearUserSessions(userId: number, currentSessionId: number, data: ClearSessions) {
    const where: FilterQuery<SessionEntity> = { user: userId };
    if (!data.include_current) where.id = { $ne: currentSessionId };

    await this.sessionRepo.nativeDelete(where);

    return;
  }

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
