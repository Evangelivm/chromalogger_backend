import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Default track configuration for chromalogger data fields
const DEFAULT_CONFIG = [
  {
    id: 'track_depth_rop',
    title: 'Prof. / ROP',
    unit: 'm / m/h',
    min: 0,
    max: 200,
    reversed: false,
    allowLog: false,
    curves: [
      { curveId: 'rop', color: '#ef4444' },
    ],
  },
  {
    id: 'track_wob_torque',
    title: 'WOB / Torque',
    unit: 'klbf / kNm',
    min: 0,
    max: 100,
    reversed: false,
    allowLog: false,
    curves: [
      { curveId: 'wob', color: '#1e40af' },
      { curveId: 'torque', color: '#7c3aed', strokeDasharray: '4 4' },
    ],
  },
  {
    id: 'track_rpm',
    title: 'RPM',
    unit: 'rpm',
    min: 0,
    max: 300,
    reversed: false,
    allowLog: false,
    curves: [
      { curveId: 'rpm', color: '#15803d' },
    ],
  },
  {
    id: 'track_spp',
    title: 'Presión Bomba',
    unit: 'psi',
    min: 0,
    max: 5000,
    reversed: false,
    allowLog: false,
    curves: [
      { curveId: 'spp', color: '#0891b2' },
    ],
  },
  {
    id: 'track_gamma',
    title: 'Rayos Gamma',
    unit: 'API',
    min: 0,
    max: 150,
    reversed: false,
    allowLog: false,
    curves: [
      { curveId: 'gammaRay', color: '#ef4444' },
    ],
  },
];

@Injectable()
export class TrackConfigService {
  async get() {
    const row = await prisma.track_config.findUnique({ where: { id: 1 } });
    return row ? (row.config as any[]) : DEFAULT_CONFIG;
  }

  async update(config: any[], userId?: string) {
    await prisma.track_config.upsert({
      where: { id: 1 },
      update: { config, updatedBy: userId },
      create: { id: 1, config, updatedBy: userId },
    });
    return config;
  }
}
