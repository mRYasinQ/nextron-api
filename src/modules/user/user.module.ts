import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import UserEntity from './user.entity';
import UserService from './user.service';
import UserAdminController from './user-admin.controller';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity])],
  controllers: [UserAdminController],
  providers: [UserService],
  exports: [UserService],
})
class UserModule {}

export default UserModule;
