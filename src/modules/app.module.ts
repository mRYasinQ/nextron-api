import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LoggerModule } from 'nestjs-pino';

import AppConfig from '@/configs/app.config';
import LoggerConfig from '@/configs/logger.config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [AppConfig] }), LoggerModule.forRootAsync(LoggerConfig)],
})
class AppModule {}

export default AppModule;
