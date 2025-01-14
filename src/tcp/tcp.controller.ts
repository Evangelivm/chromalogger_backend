import { Controller, Get } from '@nestjs/common';
import { TcpService } from './tcp.service';

@Controller('tcp')
export class TcpController {
  constructor(private readonly tcpService: TcpService) {}

  @Get('start')
  startConnection() {
    this.tcpService.connect(); // Inicia la conexión
    return 'Conexión iniciada';
  }

  @Get('stop')
  stopConnection() {
    this.tcpService.disconnect(); // Detiene la conexión
    return 'Conexión detenida';
  }
}
