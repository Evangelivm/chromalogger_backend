import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth/auth';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  // app.use(path, handler) elimina el prefijo de req.url → BetterAuth no puede rutear.
  // Con middleware global sin path, req.url llega completo (/api/auth/sign-in/username).
  app.use((req: any, res: any, next: any) => {
    if (req.url?.startsWith('/api/auth')) {
      return toNodeHandler(auth)(req, res);
    }
    next();
  });

  await app.listen(3000);
  console.log('Aplicación en ejecución en http://localhost:3000');
}

bootstrap();
