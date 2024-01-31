import { INestApplication } from '@nestjs/common';
import { resetDb } from './reset-db';
import { ApiModule } from '../../src/api/api-module';
import { NestFactory } from '@nestjs/core';

export let server: { app: INestApplication; httpServer: any };

beforeAll(async () => {
  const app = await NestFactory.create(ApiModule, { logger: false });
  await app.listen(0);
  server = {
    app,
    httpServer: app.getHttpServer(),
  };
});

afterAll(async () => {
  await server.app.close();
});

beforeEach(async () => {
  await resetDb();
});
