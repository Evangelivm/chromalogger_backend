import { Module } from '@nestjs/common';
import { TcpController } from './tcp.controller';
import { TcpService } from './tcp.service';
import { DataService } from './data.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [TcpController],
  providers: [TcpService, DataService],
  exports: [TcpService],
})
export class TcpModule {}
