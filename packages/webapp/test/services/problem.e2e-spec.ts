import { ProblemService } from '../../src/logic/services/problem';
import { app } from '../helpers/setup';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { GeneratedProblem, User } from '@prisma/client';
import { sample } from 'lodash';
import { createUserAndLogin } from '../helpers/user-login';
import { GeneratedProblemFactory } from '../helpers/factory';

describe(ProblemService.name, () => {
  describe('findProblemByIdAndUser', () => {
    let user: User;
    let problems: GeneratedProblem[] = [];
    let problemService: ProblemService;

    beforeEach(async () => {
      problemService = app.get<ProblemService>(ProblemService);
      user = (await createUserAndLogin('mail@gmail.com', 'user', 'pass')).user;

      problems = await Promise.all(
        [0, 1].map((i) =>
          GeneratedProblemFactory.create({
            tex: `problem${i}`,
            verdict: [true, null][i],
            userAssigned: { connect: user },
          })
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
