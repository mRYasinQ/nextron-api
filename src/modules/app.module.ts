import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { LoggerModule } from 'nestjs-pino';
import { ZodValidationPipe } from 'nestjs-zod';

import AppConfig from '@/configs/app.config';
import DbConfig from '@/configs/db.config';
import LoggerConfig from '@/configs/logger.config';
import ThrottleConfig from '@/configs/throttle.config';

import AppExceptionFilter from '@/shared/filters/app-exception.filter';
import TransformResponse from '@/shared/interceptors/transform-response.interceptor';

import AuthModule from './auth/auth.module';
import CommonModule from './common/common.module';
import ProfileModule from './profile/profile.module';
import SessionModule from './session/session.module';
import UserModule from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [AppConfig] }),
    LoggerModule.forRootAsync(LoggerConfig),
    ThrottlerModule.forRootAsync(ThrottleConfig),
    MikroOrmModule.forRootAsync(DbConfig),
    CacheModule.register({ isGlobal: true }),
    CommonModule,
    UserModule,
    SessionModule,
    AuthModule,
    ProfileModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponse,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
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
