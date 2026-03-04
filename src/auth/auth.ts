import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { username } from 'better-auth/plugins';
import { PrismaClient } from '@prisma/client';
import { hash, verify, Algorithm } from '@node-rs/argon2';

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'mysql' }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    password: {
      hash: (password) => hash(password, { algorithm: Algorithm.Argon2id }),
      verify: ({ hash: hashed, password }) =>
        verify(hashed, password, { algorithm: Algorithm.Argon2id }),
    },
  },
  plugins: [username()],
  trustedOrigins: [
    'http://localhost:3001',
    // add any other allowed origins for your frontend
    process.env.FRONTEND_URL || 'http://161.132.47.226:3001',
  ],
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'user',
      },
    },
  },
});
