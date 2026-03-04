import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Socket } from 'net';
import { DataService } from './data.service';
import { QueueService } from '../redis/queue.service';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

@Injectable()
export class TcpService implements OnModuleInit, OnModuleDestroy {
  private client: Socket;
  private readonly reconnectInterval = 2500;
  private isConnected = false;
  private currentHost = process.env.TCP_HOST || '127.0.0.1';
  private currentPort = parseInt(process.env.TCP_PORT || '1234', 10);

  constructor(
    private readonly dataService: DataService,
    private readonly queueService: QueueService,
  ) {}

  async onModuleInit() {
    await this.loadConfigFromDb();
    this.connect();
  }

  onModuleDestroy() {
    this.disconnect();
  }

  private async loadConfigFromDb() {
    try {
      const config = await prisma.tcp_config.findFirst({
        orderBy: { id: 'desc' },
      });
      if (config) {
        this.currentHost = config.host;
        this.currentPort = config.port;
        console.log(`TCP config loaded from DB: ${config.host}:${config.port}`);
      }
    } catch {
      console.log('No TCP config in DB, using env defaults');
    }
  }

  getStatus() {
    return {
      host: this.currentHost,
      port: this.currentPort,
      connected: this.isConnected,
    };
  }

  async getHistory() {
    const all = await prisma.tcp_config.findMany({
      orderBy: { id: 'desc' },
    });
    // Deduplicar por host:port, quedar con el más reciente de cada combo
    const seen = new Set<string>();
    return all.filter((c) => {
      const key = `${c.host}:${c.port}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  async reconnect(host: string, port: number, userId?: string) {
    this.currentHost = host;
    this.currentPort = port;

    await prisma.tcp_config.create({
      data: { host, port, updatedBy: userId },
    });

    this.disconnect();
    setTimeout(() => this.connect(), 500);
  }

  connect() {
    this.client = new Socket();

    const host = this.currentHost;
    const port = this.currentPort;

    const tryConnect = () => {
      if (this.isConnected) return;

      this.client.connect(port, host, () => {
        console.log(`Datalogger connected in ${host}:${port}`);
        this.isConnected = true;
      });
    };

    tryConnect();

    this.client.on('close', () => {
      console.log('Conexión cerrada, intentando reconectar...');
      this.isConnected = false;
      setTimeout(tryConnect, this.reconnectInterval);
    });

    this.client.on('data', async (data) => {
      try {
        const receivedData = data.toString();
        const processedData = this.dataService.processData(receivedData);
        const serializedData = JSON.stringify(processedData);
        await this.queueService.enqueueData([serializedData]);
      } catch (error) {
        console.error('Error procesando los datos:', error.message);
      }
    });

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
      this.client.end();
      this.isConnected = false;
      console.log('Conexión cerrada');
    }
  }
}
