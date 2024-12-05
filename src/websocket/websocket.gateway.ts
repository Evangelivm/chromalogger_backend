import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Configura los orígenes permitidos
  },
})
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('WebSocket initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client conected to Websocket: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected to Websocket: ${client.id}`);
  }

  // Método para emitir datos procesados
  emitData(data: any) {
    this.server.emit('sensorData', data);
  }
}
