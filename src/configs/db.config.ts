import { ConfigService } from '@nestjs/config';

import type { MikroOrmModuleAsyncOptions } from '@mikro-orm/nestjs';
import { SqliteDriver } from '@mikro-orm/sqlite';

import type { EnvConfig } from '@/shared/schemas/env.schema';

const DbConfig: MikroOrmModuleAsyncOptions = {
  inject: [ConfigService],
  driver: SqliteDriver,
  useFactory: (config: ConfigService) => ({
    driver: SqliteDriver,
    debug: config.get<EnvConfig['NODE_ENV']>('node_env') === 'development',

    discovery: {
      warnWhenNoEntities: false,
    },

    autoLoadEntities: true,

    dbName: config.get<EnvConfig['DB_NAME']>('database.name'),
  }),
};

export default DbConfig;
