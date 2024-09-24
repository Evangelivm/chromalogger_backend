// redis/queue.service.ts
import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';
import { MysqlService } from './mysql.service';

@Injectable()
export class QueueService {
  private readonly QUEUE_1 = 'queue1';
  private readonly QUEUE_2 = 'queue2';
  private readonly BACKUP_QUEUE = 'queue1_backup';
  private readonly PROCESSING_FLAG = 'processingQueue2';

  constructor(
    private readonly redisService: RedisService,
    private readonly mysqlService: MysqlService,
  ) {}

  async enqueueData(data: string[]) {
    // Envía cada elemento del array a la cola 1
    for (const item of data) {
      await this.redisService.pushToQueue(this.QUEUE_1, item);
    }
  }

  async processQueue1() {
    while (true) {
      const data = await this.redisService.popFromQueue(this.QUEUE_1);
      if (data) {
        const processingQueue2 = await this.redisService.getProcessingFlag(
          this.PROCESSING_FLAG,
        );

        if (processingQueue2 !== 'true') {
          await this.redisService.pushToQueue(this.QUEUE_2, data);
        } else {
          await this.redisService.pushToQueue(this.BACKUP_QUEUE, data);
        }
      }
    }
  }

  async processQueue2() {
    while (true) {
      const queueLength = await this.redisService.getQueueLength(this.QUEUE_2);
      if (queueLength >= 100) {
        await this.redisService.setProcessingFlag(this.PROCESSING_FLAG, 'true');
        const dataToInsert = [];

        for (let i = 0; i < 100; i++) {
          const data = await this.redisService.popFromQueue(this.QUEUE_2);
          dataToInsert.push(data);
        }

        await this.mysqlService.insertData(dataToInsert);
        await this.redisService.setProcessingFlag(
          this.PROCESSING_FLAG,
          'false',
        );
        await this.restoreQueue1();
      }
    }
  }

  private async restoreQueue1() {
    const backupLength = await this.redisService.getQueueLength(
      this.BACKUP_QUEUE,
    );
    for (let i = 0; i < backupLength; i++) {
      const data = await this.redisService.popFromQueue(this.BACKUP_QUEUE);
      await this.redisService.pushToQueue(this.QUEUE_2, data);
    }
  }
}
