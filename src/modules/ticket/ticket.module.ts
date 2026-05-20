import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import StorageModule from '../storage/storage.module';
import UserModule from '../user/user.module';
import TicketEntity from './entities/ticket.entity';
import TicketMessageEntity from './entities/ticket-message.entity';
import TicketController from './ticket.controller';
import TicketService from './ticket.service';

@Module({
  imports: [MikroOrmModule.forFeature([TicketEntity, TicketMessageEntity]), StorageModule, UserModule],
  controllers: [TicketController],
  providers: [TicketService],
})
class TicketModule {}

export default TicketModule;
