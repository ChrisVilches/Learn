import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api/api.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(ApiModule);
  await app.listen(3000);
}

bootstrap().catch(console.error);
