import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { SiteConfigService } from './site-config.service';
import { AdminGuard } from '../guards/admin.guard';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../auth/auth';

@Controller('site-config')
export class SiteConfigController {
  constructor(private readonly siteConfigService: SiteConfigService) {}

  @Get()
  get() {
    return this.siteConfigService.get();
  }

  @Put()
  @UseGuards(AdminGuard)
  async update(
    @Body() body: { wellName: string; companyName: string },
    @Req() req: any,
  ) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    return this.siteConfigService.update(body, session?.user?.id);
  }
}
