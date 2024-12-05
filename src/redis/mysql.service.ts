import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class MysqlService {
  constructor(private prisma: PrismaService) {}

  async insertData(data: string[]) {
    if (data.length === 0) return;

    const parsedData = data.map((item) => JSON.parse(item));

    const records = parsedData.flatMap((entry) =>
      entry.dataGroup.map((item) => ({
        DEPTH: item.DEPTH,
        HOLE_DEPTH: item.HOLE_DEPTH,
        BLOCK_HEIGHT: item.BLOCK_HEIGHT,
        ROP: item.ROP,
        HOOKLOAD: item.HOOKLOAD,
        SLIPS: item.SLIPS,
        ON_BOTTOM: item.ON_BOTTOM,
        RPM: item.RPM,
        FLOW: item.FLOW,
        SPP: item.SPP,
        SPM1: item.SPM1,
        SPM2: item.SPM2,
        WOB: item.WOB,
        TORQ: item.TORQ,
        INC: item.INC,
        AZM: item.AZM,
        AZMC: item.AZMC,
        GTOT: item.GTOT,
        BTOT: item.BTOT,
        DIP: item.DIP,
        TF: item.TF,
        GAM: item.GAM,
        time: item.time,
        // time: item.timestamp,
        // Convierte el timestamp de texto a Date antes de guardarlo
        //time: this.convertTimestamp(item.timestamp),
      })),
    );

    try {
      await this.prisma.test_record.createMany({
        data: records,
        skipDuplicates: true, // Evita duplicados
      });

      console.log('\x1b[32m%s\x1b[0m', 'Data inserted');
    } catch (error) {
      console.error('Error al insertar datos:', error);
    }
  }

  // // Función para convertir el timestamp de texto a un objeto Date
  // private convertTimestamp(timestamp: string): Date {
  //   // Paso 1: Reemplazar `p. m.` y `a. m.` por 'PM' y 'AM'
  //   const normalizedTimestamp = timestamp
  //     .replace('p. m.', 'PM')
  //     .replace('a. m.', 'AM');

  //   // Paso 2: Separar la fecha y la hora
  //   const [datePart, timePart] = normalizedTimestamp.split(', ');

  //   // Paso 3: Convertir la fecha de 'día/mes/año' a 'año-mes-día' para formato ISO
  //   const [day, month, year] = datePart.split('/').map(Number);

  //   // Paso 4: Crear una cadena de fecha y hora en formato ISO para JavaScript
  //   const isoDateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${timePart}`;

  //   // Paso 5: Crear un objeto Date con la cadena ISO generada
  //   const date = new Date(isoDateString);

  //   // Verificar si el objeto Date es válido
  //   if (isNaN(date.getTime())) {
  //     throw new Error(`Fecha inválida: ${timestamp}`);
  //   }

  //   return date;
  // }
}
