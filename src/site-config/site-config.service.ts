import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULTS = { wellName: 'Pozo 1', companyName: 'Enterprise' };

@Injectable()
export class SiteConfigService {
  async get() {
    const config = await prisma.site_config.findUnique({ where: { id: 1 } });
    return config ?? { id: 1, ...DEFAULTS };
  }

  async update(data: { wellName: string; companyName: string }, userId?: string) {
    return prisma.site_config.upsert({
      where: { id: 1 },
      update: { ...data, updatedBy: userId },
      create: { id: 1, ...data, updatedBy: userId },
    });
  }
}
