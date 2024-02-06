import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api/api-module';
import { DelayInterceptor } from './api/interceptors/delay';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { isString, isEmpty } from 'lodash';
import { patchNestJsSwagger } from 'nestjs-zod';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(ApiModule);
  app.use(helmet());

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
    app.useGlobalInterceptors(new DelayInterceptor());
  }

  if (isString(process.env.ALLOW_HOST) && !isEmpty(process.env.ALLOW_HOST)) {
    app.enableCors({ origin: process.env.ALLOW_HOST });
  }

  patchNestJsSwagger();
  const config = new DocumentBuilder()
    .setTitle('Learn App')
    .setDescription('Learn App API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap().catch(console.error);
