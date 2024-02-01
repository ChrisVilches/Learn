import { INestApplication } from '@nestjs/common';
import { resetDb } from './reset-db';
import { ApiModule } from '../../src/api/api-module';
import { NestFactory } from '@nestjs/core';
import { initialize } from '../../src/__generated__/fabbrica';
import prisma from './prisma';

initialize({ prisma });

export let app: INestApplication;
export let httpServer: any;

beforeAll(async () => {
  app = await NestFactory.create(ApiModule, { logger: false });
  await app.listen(0);
  httpServer = app.getHttpServer();
});

afterAll(async () => {
  await app.close();
});

beforeEach(async () => {
  await resetDb();
});
