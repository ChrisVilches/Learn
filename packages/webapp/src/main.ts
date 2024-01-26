import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api/api.module';
import { DelayInterceptor } from './api/interceptors/delay';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(ApiModule);
  app.enableCors();

  if (process.env.NODE_ENV === 'development') {
    app.useGlobalInterceptors(new DelayInterceptor());
  }

  await app.listen(3000);
}

bootstrap().catch(console.error);
