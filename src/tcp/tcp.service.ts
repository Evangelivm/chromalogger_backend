import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Socket } from 'net';
import { DataService } from './data.service';
import { QueueService } from '../redis/queue.service';
import * as dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

@Injectable()
export class TcpService implements OnModuleInit, OnModuleDestroy {
  private client: Socket;
  private readonly reconnectInterval = 2500; // Tiempo de espera antes de intentar reconectar (en ms)
  private isConnected = false; // Bandera para verificar si está conectado

  constructor(
    private readonly dataService: DataService,
    private readonly queueService: QueueService,
  ) {}

  onModuleInit() {
    this.connect();
  }

  onModuleDestroy() {
    this.disconnect(); // Cierra la conexión cuando el módulo se destruye
  }

  connect() {
    this.client = new Socket();

    // Obtén el host y el puerto desde las variables de entorno, con valores por defecto
    const host = process.env.TCP_HOST || '127.0.0.1';
    const port = parseInt(process.env.TCP_PORT || '1234', 10);

    const tryConnect = () => {
      if (this.isConnected) return; // Evita múltiples intentos si ya está conectado

      this.client.connect(port, host, () => {
        console.log(`Datalogger connected in ${host}:${port}`);
        this.isConnected = true;
      });
    };

    tryConnect();

    // Evento para intentar reconectar en caso de desconexión
    this.client.on('close', () => {
      console.log('Conexión cerrada, intentando reconectar...');
      this.isConnected = false;
      setTimeout(tryConnect, this.reconnectInterval); // Intento de reconexión
    });

    // Maneja los datos recibidos
    this.client.on('data', async (data) => {
      try {
        const receivedData = data.toString();
        const processedData = this.dataService.processData(receivedData);
        const serializedData = JSON.stringify(processedData);

        await this.queueService.enqueueData([serializedData]);
      } catch (error) {
        console.error(
          'Error procesando los datos o enviando a Redis:',
          error.message,
        );
      }
    });

    // Maneja errores de conexión y reconexión en caso de fallo
    this.client.on('error', (err) => {
      console.error(`Error en la conexión: ${err.message}`);
      if (this.isConnected) {
        this.isConnected = false;
        setTimeout(tryConnect, this.reconnectInterval);
      }
    });
  }

  disconnect() {
    if (this.client) {
      this.client.end(); // Cierra la conexión TCP
      this.isConnected = false;
      console.log('Conexión cerrada');
    }
  }
}
