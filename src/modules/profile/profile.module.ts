import { Module } from '@nestjs/common';

import UserModule from '../user/user.module';
import ProfileController from './profile.controller';

@Module({
  imports: [UserModule],
  controllers: [ProfileController],
})
class ProfileModule {}

export default ProfileModule;
