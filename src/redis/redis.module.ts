import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './redis.service';
import { MysqlService } from './mysql.service';
import { QueueService } from './queue.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule],
  providers: [RedisService, MysqlService, QueueService, PrismaService],
  exports: [QueueService, PrismaService],
})
export class RedisModule {}
