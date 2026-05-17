import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { LoggerModule } from 'nestjs-pino';

import AppConfig from '@/configs/app.config';
import DbConfig from '@/configs/db.config';
import LoggerConifg from '@/configs/logger.config';

import CommandModule from './command/command.module';
import CommonModule from './common/common.module';
import UserModule from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [AppConfig] }),
    LoggerModule.forRootAsync(LoggerConifg),
    MikroOrmModule.forRootAsync(DbConfig),
    CommonModule,
    UserModule,
    CommandModule,
  ],
})
class CliModule {}

export default CliModule;
