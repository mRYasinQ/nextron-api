import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { LoggerModule } from 'nestjs-pino';
import { ZodValidationPipe } from 'nestjs-zod';

import AppConfig from '@/configs/app.config';
import DbConfig from '@/configs/db.config';
import LoggerConfig from '@/configs/logger.config';

import AppExceptionFilter from '@/shared/filters/app-exception.filter';
import TransformResponse from '@/shared/interceptors/transform-response.interceptor';

import CommonModule from './common/common.module';
import UserModoule from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [AppConfig] }),
    LoggerModule.forRootAsync(LoggerConfig),
    MikroOrmModule.forRootAsync(DbConfig),
    CommonModule,
    UserModoule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponse,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ],
})
class AppModule {}

export default AppModule;
