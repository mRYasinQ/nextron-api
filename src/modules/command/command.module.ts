import { Module } from '@nestjs/common';

import UserModule from '../user/user.module';
import SuperuserCommand from './providers/superuser.command';
import SuperuserQuestions from './questions/superuser.questions';

@Module({
  imports: [UserModule],
  providers: [SuperuserCommand, SuperuserQuestions],
})
class CommandModule {}

export default CommandModule;
