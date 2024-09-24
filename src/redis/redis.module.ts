import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './redis.service';
import { MysqlService } from './mysql.service';
import { QueueService } from './queue.service';

@Module({
  imports: [ConfigModule],
  providers: [RedisService, MysqlService, QueueService],
  exports: [QueueService],
})
export class RedisModule {}
