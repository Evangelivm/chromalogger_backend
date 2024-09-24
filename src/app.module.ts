import { Module } from '@nestjs/common';
import { TcpModule } from './tcp/tcp.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [TcpModule, ConfigModule.forRoot(), RedisModule],
})
export class AppModule {}
