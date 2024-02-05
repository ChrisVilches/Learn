import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api/api-module';
import { DelayInterceptor } from './api/interceptors/delay';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { isString, isEmpty } from 'lodash'

// TODO: I'd like to revamp some of the code using Zod using this:
//       https://github.com/risen228/nestjs-zod
//       Things I'd like to implement:
//       * Use the `createZodDto` function to automate (?) some things.
//       * Automate the Swagger documentation generation.
//       * Use the added types like `password`.
//       * Remove my custom pipe, and use the one that comes in the library
//         (it throws an exception different from ZodError, so it works for my case).
//       * Use (many) other features.

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
