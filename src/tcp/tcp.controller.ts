import { Controller, Get } from '@nestjs/common';
import { TcpService } from './tcp.service';
import { SerialService } from './serial.service'; // Nuevo servicio

@Controller('tcp')
export class TcpController {
  constructor(
    private readonly tcpService: TcpService,
    private readonly serialService: SerialService, // Nuevo servicio
  ) {}

  @Get('start-tcp')
  startTcpConnection() {
    this.tcpService.connect();
    return 'Conexión TCP iniciada';
  }

  @Get('stop-tcp')
  stopTcpConnection() {
    this.tcpService.disconnect();
    return 'Conexión TCP detenida';
  }

  @Get('start-serial')
  startSerialConnection() {
    this.serialService.connect();
    return 'Conexión Serial iniciada';
  }

  @Get('stop-serial')
  stopSerialConnection() {
    this.serialService.disconnect();
    return 'Conexión Serial detenida';
  }
}
