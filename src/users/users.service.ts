import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { hash, Algorithm } from '@node-rs/argon2';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    name: string;
    username: string;
    email: string;
    password: string;
    role?: string;
  }) {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ username: data.username }, { email: data.email }] },
    });

    if (existing) {
      throw new ConflictException('El username o email ya existe');
    }

    const userId = randomUUID();
    const now = new Date();
    const hashedPassword = await hash(data.password, {
      algorithm: Algorithm.Argon2id,
    });

    const user = await prisma.user.create({
      data: {
        id: userId,
        name: data.name,
        username: data.username,
        email: data.email,
        emailVerified: true,
        role: data.role ?? 'user',
        createdAt: now,
        updatedAt: now,
      },
    });

    await prisma.account.create({
      data: {
        id: randomUUID(),
        accountId: userId,
        providerId: 'credential',
        userId,
        password: hashedPassword,
        createdAt: now,
        updatedAt: now,
      },
    });

    return { id: user.id, username: user.username, email: user.email, role: user.role };
  }

  async remove(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}
