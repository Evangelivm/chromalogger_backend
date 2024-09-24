// redis/mysql.service.ts
import { Injectable } from '@nestjs/common';
import { createPool, Pool } from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MysqlService {
  private pool: Pool;

  constructor(private configService: ConfigService) {
    this.createPool();
  }

  private createPool() {
    this.pool = createPool({
      host: this.configService.get<string>('HOST_NAME'), // Nombre del host de la base de datos
      user: this.configService.get<string>('DB_USER'), // Usuario de la base de datos
      database: this.configService.get<string>('DB_NAME'), // Nombre de la base de datos
      password: this.configService.get<string>('DB_PASS'), // Contraseña de la base de datos
      port: this.configService.get<number>('DB_PORT'), // Puerto de la base de datos
      waitForConnections: true,
      connectionLimit: 10, // Limita el número de conexiones
      queueLimit: 0, // Sin límite en la cola de conexiones
    });
  }

  async insertData(data: string[]) {
    const query = 'INSERT INTO test_record (column) VALUES ?'; // Cambia 'your_table' y 'column' según tu esquema
    await this.pool.query(query, [data.map((item) => [item])]);
  }

  async closePool() {
    await this.pool.end(); // Asegúrate de cerrar el pool al terminar
  }
}
