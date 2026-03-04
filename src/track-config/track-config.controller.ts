import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { TrackConfigService } from './track-config.service';
import { AdminGuard } from '../guards/admin.guard';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../auth/auth';

@Controller('track-config')
export class TrackConfigController {
  constructor(private readonly trackConfigService: TrackConfigService) {}

  @Get()
  get() {
    return this.trackConfigService.get();
  }

  @Put()
  @UseGuards(AdminGuard)
  async update(@Body() body: any[], @Req() req: any) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    return this.trackConfigService.update(body, session?.user?.id);
  }
}
