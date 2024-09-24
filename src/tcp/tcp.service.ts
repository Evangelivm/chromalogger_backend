import { Injectable, OnModuleInit } from '@nestjs/common';
import { Socket } from 'net';
import { DataService } from './data.service';
import { QueueService } from '../redis/queue.service';

@Injectable()
export class TcpService implements OnModuleInit {
  private client: Socket;

  constructor(
    private readonly dataService: DataService,
    private readonly queueService: QueueService, // Inyecta QueueService
  ) {}

  onModuleInit() {
    this.connect();
  }

  connect() {
    this.client = new Socket();
    this.client.connect(1234, '127.0.0.1', () => {
      console.log('Conectado al datalogger en 127.0.0.1:1234');
    });

    this.client.on('data', async (data) => {
      const receivedData = data.toString();
      const processedData = this.dataService.processData(receivedData); // Procesa los datos

      // Serializa los datos a JSON antes de enviarlos a la cola
      //const serializedData = processedData.map((item) => JSON.stringify(item));

      // Envía los datos procesados (serializados) a la cola
      //await this.queueService.enqueueData(serializedData);
    });

    this.client.on('error', (err) => {
      console.error(`Error en la conexión: ${err.message}`);
    });

    this.client.on('close', () => {
      console.log('Conexión cerrada');
    });
  }

  disconnect() {
    if (this.client) {
      this.client.end(); // Cierra la conexión TCP
      console.log('Conexión cerrada');
    }
  }
}
