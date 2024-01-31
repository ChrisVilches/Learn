import { ProblemService } from '../../src/logic/services/problem';
import prisma from '../helpers/prisma';
import { server } from '../helpers/setup';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Category, GeneratedProblem, User } from '@prisma/client';
import { sample } from 'lodash';
import { createUserAndLogin } from '../helpers/user-login';

describe(ProblemService.name, () => {
  describe('findProblemByIdAndUser', () => {
    let user: User;
    let category: Category;
    let problems: GeneratedProblem[] = [];
    let problemService: ProblemService;

    beforeEach(async () => {
      problemService = server.app.get<ProblemService>(ProblemService);
      const result = await createUserAndLogin('mail@gmail.com', 'user', 'pass');
      user = result.user;

      category = await prisma.category.create({
        data: {
          slug: 'slug',
          name: 'name',
          description: 'description',
        },
      });

      const problemGenerator = await prisma.problemGenerator.create({
        data: {
          name: 'a',
          categoryId: category.id,
        },
      });

      problems = await Promise.all(
        [0, 1].map((i) =>
          prisma.generatedProblem.create({
            data: {
              problemGeneratorId: problemGenerator.id,
              tex: `problem${i}`,
              verdict: [true, null][i],
              difficulty: 50,
              content: {},
              userAssignedId: user.id,
              categoryId: category.id,
            },
          }),
        ),
      );
    });

    it('throws if problem was already solved', async () => {
      await expect(() =>
        problemService.findProblemByIdAndUser(problems[0].id, user.id, {
          includeSolved: false,
        }),
      ).rejects.toThrow(PrismaClientKnownRequestError);
    });

    it('finds solved problem if search conditions allow it', async () => {
      const problem = await problemService.findProblemByIdAndUser(
        problems[0].id,
        user.id,
        {
          includeSolved: true,
        },
      );

      expect(problem).toMatchObject({ tex: 'problem0', verdict: true });
    });

    it('finds unsolved problem', async () => {
      const problem = await problemService.findProblemByIdAndUser(
        problems[1].id,
        user.id,
        {
          includeSolved: sample([false, true]),
        },
      );

      expect(problem).toMatchObject({ tex: 'problem1', verdict: null });
    });
  });
});
