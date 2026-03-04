import { Module } from '@nestjs/common';
import { TcpModule } from './tcp/tcp.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';
import { SiteConfigModule } from './site-config/site-config.module';
import { TrackConfigModule } from './track-config/track-config.module';

@Module({
  imports: [TcpModule, ConfigModule.forRoot(), RedisModule, UsersModule, SiteConfigModule, TrackConfigModule],
})
export class AppModule {}
