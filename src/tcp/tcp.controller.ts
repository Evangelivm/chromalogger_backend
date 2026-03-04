import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { TcpService } from './tcp.service';
import { AdminGuard } from '../guards/admin.guard';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../auth/auth';

@Controller('tcp')
export class TcpController {
  constructor(private readonly tcpService: TcpService) {}

  @Get('status')
  getStatus() {
    return this.tcpService.getStatus();
  }

  @Get('history')
  getHistory() {
    return this.tcpService.getHistory();
  }

  @Post('config')
  @UseGuards(AdminGuard)
  async setConfig(
    @Body() body: { host: string; port: number },
    @Req() req: any,
  ) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    await this.tcpService.reconnect(body.host, body.port, session?.user?.id);
    return { message: 'Reconectando...', host: body.host, port: body.port };
  }

  @Get('start')
  startConnection() {
    this.tcpService.connect();
    return 'Conexión iniciada';
  }

  @Get('stop')
  stopConnection() {
    this.tcpService.disconnect();
    return 'Conexión detenida';
  }
}
