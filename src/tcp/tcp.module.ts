import { Module } from '@nestjs/common';
import { TcpController } from './tcp.controller';
import { TcpService } from './tcp.service';
import { SerialService } from './serial.service'; // Nuevo servicio
import { DataService } from './data.service';
import { RedisModule } from '../redis/redis.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [RedisModule, WebsocketModule],
  controllers: [TcpController],
  providers: [TcpService, SerialService, DataService], // Agregado SerialService
  exports: [TcpService, SerialService], // Exportar también SerialService si es necesario
})
export class TcpModule {}
