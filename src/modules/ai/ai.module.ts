import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import AiController from './ai.controller';
import AiEntity from './ai.entity';

@Module({
  imports: [MikroOrmModule.forFeature([AiEntity])],
  controllers: [AiController],
})
class AiModule {}

export default AiModule;
