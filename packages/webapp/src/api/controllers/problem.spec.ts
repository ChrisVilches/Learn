import { Test, type TestingModule } from '@nestjs/testing';
import { ProblemController } from '../controllers/problem';

describe('ProblemController', () => {
  let problemController: ProblemController;

  beforeEach(async () => {
    const api: TestingModule = await Test.createTestingModule({
      controllers: [ProblemController],
      providers: [],
    }).compile();

    problemController = api.get<ProblemController>(ProblemController);
  });

  describe('root', () => {});
});
