import path from 'node:path';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { Logger } from 'nestjs-pino';

import setupSwagger from './configs/swagger.config';

import AppModule from './modules/app.module';

import type { EnvConfig } from './shared/schemas/env.schema';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));

  app.set('trust proxy', 'loopback');

  app.useStaticAssets(path.join(__dirname, '..', 'public'), { prefix: '/public/' });

  const config = app.get(ConfigService);
  const enableSwagger = config.getOrThrow<EnvConfig['ENABLE_SWAGGER']>('app.enable_swagger');
  const corsOrigins = config.get<EnvConfig['CORS_ORIGINS']>('app.cors_origins');
  const url = config.getOrThrow<EnvConfig['APP_URL']>('app.url');
  const port = config.getOrThrow<EnvConfig['APP_PORT']>('app.port');

  if (corsOrigins) {
    app.enableCors({
      origin: corsOrigins,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: corsOrigins === '*' ? false : true,
    });
  }

  if (enableSwagger) setupSwagger(app, url);

  await app.listen(port);
}

void bootstrap();
