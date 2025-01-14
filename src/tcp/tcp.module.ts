import { Module } from '@nestjs/common';
import { TcpController } from './tcp.controller';
import { TcpService } from './tcp.service';
import { DataService } from './data.service';
import { RedisModule } from '../redis/redis.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [RedisModule, WebsocketModule],
  controllers: [TcpController],
  providers: [TcpService, DataService],
  exports: [TcpService],
})
export class TcpModule {}
