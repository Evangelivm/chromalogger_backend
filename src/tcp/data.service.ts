import { Injectable } from '@nestjs/common';

@Injectable()
export class DataService {
  private previousData = {};

  private codeMap = {
    '0108': 'DEPTH',
    '0110': 'HOLE_DEPTH',
    '0112': 'BLOCK_HEIGHT',
    '0113': 'ROP',
    '0114': 'HOOKLOAD',
    '0145': 'SLIPS',
    '0144': 'ON_BOTTOM',
    '0120': 'RPM',
    '0130': 'FLOW',
    '0121': 'SPP',
    '0123': 'SPM1',
    '0124': 'SPM2',
    '0116': 'WOB',
    '0118': 'TORQ',
    '0713': 'INC',
    '0714': 'AZM',
    '0715': 'AZMC',
    '0722': 'GTOT',
    '0723': 'BTOT',
    '0724': 'DIP',
    '0717': 'TF',
    '0823': 'GAM',
  };

  processData(data: string) {
    const lines = data.split('\n').map((line) => line.trim());
    const result = [];

    for (const line of lines) {
      const code = line.slice(0, 4);
      const value = line.slice(4).trim();

      if (this.codeMap[code]) {
        let processedValue = value;

        // Reemplazo específico para ON_BOTTOM
        if (this.codeMap[code] === 'ON_BOTTOM') {
          processedValue = value === '1' ? 'YES' : 'NO';
        }

        // Reemplazo específico para SLIPS
        if (this.codeMap[code] === 'SLIPS') {
          processedValue = value === '1' ? 'YES' : 'NO';
        }

        // Actualiza el valor anterior en la estructura
        this.previousData[this.codeMap[code]] = processedValue;

        result.push({ [this.codeMap[code]]: processedValue });
      }
    }

    // Agregar timestamp
    const timestamp = new Date().toLocaleString();
    result.push({ timestamp });

    // Asegurar que siempre se envíen todos los valores retenidos
    const completeResult = Object.entries(this.previousData).map(
      ([name, value]) => ({ [name]: value }),
    );
    completeResult.push({ timestamp });
    // Devuelve el resultado completo en lugar de solo hacer console.log
    //return completeResult;
    console.log('Datos procesados:', { dataGroup: completeResult });
  }
}
