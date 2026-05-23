import { ConfigService } from '@nestjs/config';

import { EntityManager, RequestContext } from '@mikro-orm/sqlite';
import { Command, CommandRunner, InquirerService } from 'nest-commander';

import baseUserSchema from '@/shared/schemas/user.schema';

import UserService from '../../user/user.service';
import type { SuperuserData } from '../interfaces/superuser.interface';
import { SUPERUSER_QUESTION_KEY } from '../questions/superuser.questions';

@Command({
  name: 'create-superuser',
  description: 'Create user with all exist permissions',
})
class SuperuserCommand extends CommandRunner {
  constructor(
    private readonly em: EntityManager,
    private readonly config: ConfigService,
    private readonly inquirerService: InquirerService,
    private readonly userService: UserService,
  ) {
    super();
  }

  async run(_inputs: string[], _options?: Record<string, unknown>): Promise<void> {
    console.log('--- Nextron Superuser Creation ---');

    try {
      const answers = await this.inquirerService.ask<SuperuserData>(SUPERUSER_QUESTION_KEY, undefined);

      const validateAnswers = await baseUserSchema.safeParseAsync(answers);
      if (!validateAnswers.success) {
        console.error(validateAnswers.error.issues[0].message);
        process.exit(1);
      }

      console.log('Creating superuser...');

      const fork = this.em.fork();
      await RequestContext.create(fork, async () => {
        await this.userService.create({
          ...validateAnswers.data,
          is_active: true,
          is_admin: true,
          is_phone_verified: true,
          is_email_verified: answers.email ? true : false,
        });
      });

      console.log('Superuser created successfully!');
      process.exit(0);
    } catch {
      console.error(`Creation failed.`);
      process.exit(1);
    }
  }
}

export default SuperuserCommand;
