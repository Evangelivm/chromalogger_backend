import { PrismaClient } from '@prisma/client';
import { hash, Algorithm } from '@node-rs/argon2';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function createAdmin() {
  const username = 'admin';
  const name = 'Administrador';
  const email = 'admin@chromalogger.com';
  const password = 'admin1234'; // cambia esto antes de producción

  // Verificar si ya existe
  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });

  if (existing) {
    console.log(`⚠️  Ya existe un usuario con username="${username}" o email="${email}".`);
    return;
  }

  const userId = randomUUID();
  const accountId = randomUUID();
  const now = new Date();

  const hashedPassword = await hash(password, { algorithm: Algorithm.Argon2id });

  await prisma.user.create({
    data: {
      id: userId,
      name,
      email,
      emailVerified: true,
      username,
      role: 'admin',
      createdAt: now,
      updatedAt: now,
    },
  });

  await prisma.account.create({
    data: {
      id: accountId,
      accountId: userId,
      providerId: 'credential',
      userId,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    },
  });

  console.log(`✅ Usuario admin creado:`);
  console.log(`   username : ${username}`);
  console.log(`   email    : ${email}`);
  console.log(`   password : ${password}`);
}

createAdmin()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
