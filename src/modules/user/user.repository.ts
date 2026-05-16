import { EntityRepository } from '@mikro-orm/sqlite';

import UserEntity from './user.entity';

class UserRepository extends EntityRepository<UserEntity> {}

export default UserRepository;
