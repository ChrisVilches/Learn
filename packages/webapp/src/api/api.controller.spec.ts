import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';

describe('ApiController', () => {
  let apiController: ApiController;

  beforeEach(async () => {
    const api: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [],
    }).compile();

    apiController = api.get<ApiController>(ApiController);
  });

  describe('root', () => {});
});
