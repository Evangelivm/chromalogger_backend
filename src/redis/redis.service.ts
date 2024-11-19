// redis/redis.service.ts
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class RedisService {
  private redisClient: Redis;

  constructor() {
    // Configura la conexión a Redis
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost', // Cambia esto según tu configuración de Redis
      port: parseInt(process.env.REDIS_PORT || '6379'),
    });
  }

  // Agregar elementos a la cola
  async pushToQueue(queueName: string, data: string) {
    await this.redisClient.rpush(queueName, data);
  }

  // Sacar un elemento de la cola
  async popFromQueue(queueName: string): Promise<string | null> {
    return await this.redisClient.lpop(queueName);
  }

  // Obtener la longitud de la cola
  async getQueueLength(queueName: string): Promise<number> {
    return await this.redisClient.llen(queueName);
  }

  // Establecer bandera de procesamiento
  async setProcessingFlag(flag: string, value: string) {
    await this.redisClient.set(flag, value);
  }

  // Obtener bandera de procesamiento
  async getProcessingFlag(flag: string): Promise<string | null> {
    return await this.redisClient.get(flag);
  }
}
