import { Module } from '@nestjs/common';
import { TrackConfigController } from './track-config.controller';
import { TrackConfigService } from './track-config.service';

@Module({
  controllers: [TrackConfigController],
  providers: [TrackConfigService],
})
export class TrackConfigModule {}
