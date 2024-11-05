// src/websocket/websocket.module.ts
import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';

@Module({
  providers: [WebsocketGateway],
  exports: [WebsocketGateway], // Exportar para que otros módulos lo usen
})
export class WebsocketModule {}
