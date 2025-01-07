import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { SerialPort } from 'serialport';
import { DataService } from './data.service';
import { QueueService } from '../redis/queue.service';

@Injectable()
export class SerialService implements OnModuleInit, OnModuleDestroy {
  private port: SerialPort;

  constructor(
    private readonly dataService: DataService,
    private readonly queueService: QueueService,
  ) {}

  onModuleInit() {
    this.connect();
  }

  onModuleDestroy() {
    this.disconnect();
  }

  connect() {
    const portPath = process.env.SERIAL_PORT || '/dev/ttyUSB0';
    const baudRate = parseInt(process.env.SERIAL_BAUD_RATE || '9600', 10);

    this.port = new SerialPort({
      path: portPath,
      baudRate: baudRate,
    });

    this.port.on('open', () => {
      console.log(`Serial port opened: ${portPath} at baudRate ${baudRate}`);
    });

    this.port.on('data', async (data: Buffer) => {
      try {
        const receivedData = data.toString();
        const processedData = this.dataService.processData(receivedData);
        const serializedData = JSON.stringify(processedData);

        await this.queueService.enqueueData([serializedData]);
      } catch (error) {
        console.error(
          'Error procesando los datos recibidos por puerto serial:',
          error.message,
        );
      }
    });

    this.port.on('error', (err) => {
      console.error(`Error en el puerto serial: ${err.message}`);
    });
  }

  disconnect() {
    if (this.port && this.port.isOpen) {
      this.port.close((err) => {
        if (err) {
          console.error(`Error cerrando el puerto serial: ${err.message}`);
        } else {
          console.log('Puerto serial cerrado');
        }
      });
    }
  }
}
