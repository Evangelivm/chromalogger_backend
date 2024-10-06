import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from './redis.service';
import { MysqlService } from './mysql.service';

@Injectable()
export class QueueService implements OnModuleInit {
  private readonly QUEUE_1 = 'queue1';
  private readonly QUEUE_2 = 'queue2';
  private readonly PROCESSING_FLAG = 'processingQueue2';

  constructor(
    private readonly redisService: RedisService,
    private readonly mysqlService: MysqlService,
  ) {}

  // Este método se ejecuta cuando el módulo se inicializa
  onModuleInit() {
    this.startProcessingQueue2();
  }

  async startProcessingQueue2() {
    console.log('Iniciando el procesamiento de queue2...');
    await this.processQueue2(); // Llama a la función para empezar el procesamiento de forma continua
  }

  async enqueueData(data: string[]) {
    for (const item of data) {
      await this.redisService.pushToQueue(this.QUEUE_1, item);
      await this.processQueue1();
    }
  }

  async processQueue1() {
    const data = await this.redisService.popFromQueue(this.QUEUE_1);
    if (data) {
      const processingQueue2 = await this.redisService.getProcessingFlag(
        this.PROCESSING_FLAG,
      );
      if (processingQueue2 !== 'true') {
        await this.redisService.pushToQueue(this.QUEUE_2, data);
        const queueLength = Number(
          await this.redisService.getQueueLength(this.QUEUE_2),
        );
        console.log(
          '\x1b[35m%s\x1b[0m',
          `Tamaño actual de la cola 2a: ${queueLength}`,
        );
      }
    }
  }

  async processQueue2() {
    while (true) {
      const queueLength = Number(
        await this.redisService.getQueueLength(this.QUEUE_2),
      );
      console.log(
        '\x1b[34m%s\x1b[0m',
        `Tamaño actual de la cola 2b: ${queueLength}`,
      );

      if (queueLength >= 100) {
        console.log(
          '\x1b[33m%s\x1b[0m',
          `La cola 2 tiene 100 o más registros, procesando...`,
        );
        await this.redisService.setProcessingFlag(this.PROCESSING_FLAG, 'true');

        const dataToInsert = [];

        for (let i = 0; i < 100; i++) {
          const data = await this.redisService.popFromQueue(this.QUEUE_2);
          if (data) {
            dataToInsert.push(data);
          }
        }
        //console.log(dataToInsert);
        await this.mysqlService.insertData(dataToInsert);
        console.log(
          '\x1b[36m%s\x1b[0m',
          'Se ha enviado la información a la base de datos',
        );

        await this.redisService.setProcessingFlag(
          this.PROCESSING_FLAG,
          'false',
        );
        console.log(
          '\x1b[33m%s\x1b[0m',
          'Flag de procesamiento restablecido a false',
        );

        await this.restoreQueue1();
      }

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Espera de 1 segundo
    }
  }

  private async restoreQueue1() {
    while (true) {
      const data = await this.redisService.popFromQueue(this.QUEUE_1);
      if (!data) {
        console.log(
          '\x1b[33m%s\x1b[0m',
          'No hay más datos en la cola 1 para mover a la cola 2',
        );
        break;
      }
      await this.redisService.pushToQueue(this.QUEUE_2, data);
      const queueLength = Number(
        await this.redisService.getQueueLength(this.QUEUE_2),
      );
      console.log(
        '\x1b[33m%s\x1b[0m',
        `Datos restaurados de la cola 1 a la cola 2: ${data}`,
      );
      console.log(
        `Tamaño actual de la cola 2 después de restaurar: ${queueLength}`,
      );
    }
  }
}
