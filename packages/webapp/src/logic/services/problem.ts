import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma';
import {
  type User,
  type Prisma,
  type Category,
  type GeneratedProblem,
} from '@prisma/client';
import { SolutionCannotBeProcessed } from '../problem-errors';
import { CategoryService } from './category';
import { problemGenerators } from 'problem-generator';
import { SolutionVerdict } from 'problem-generator';
import { ProblemSolutionOptions } from 'problem-generator';

@Injectable()
export class ProblemService {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly prisma: PrismaService,
  ) {}

  async generateProblem(
    user: User,
    difficulty: number,
    category: Category,
  ): Promise<GeneratedProblem & ProblemSolutionOptions> {
    const { id, name } = await this.categoryService.pickRandomSelectedGenerator(
      user,
      category,
    );

    const gen = problemGenerators[name];
    const { tex, debugInformation, content } =
      await gen.fromDifficulty(difficulty);

    const data: Prisma.GeneratedProblemCreateInput = {
      difficulty,
      problemGenerator: { connect: { id, name } },
      tex,
      debugInformation,
      userAssigned: { connect: { id: user.id } },
      category: { connect: category },
      content,
    };

    const generatedProblem = await this.prisma.generatedProblem.create({
      data,
      include: { problemGenerator: { select: { id: true, name: true } } },
    });

    const problemSolutionOptions = {
      freeInput: gen.freeInput,
      choiceAnswers: gen.choiceAnswers,
    };

    return { ...generatedProblem, ...problemSolutionOptions };
  }

  async getUserSolvedStats(userId: number, daysAgo: number) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - daysAgo);

    // TODO: Either improve this query, or turn this process into a job that
    //       does some data pre-processing and stores it in a fast to read way.
    //       Alternatives:
    //       (1) Periodically check users that can be updated.
    //       (2) Create a stream of solved problems, and have one or multiple workers reading
    //           from the stream, processing and storing the data.
    const all = await this.prisma.generatedProblem.findMany({
      select: {
        createdAt: true,
        verdict: true,
      },
      where: {
        userAssignedId: userId,
        createdAt: {
          gte: fromDate,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const groups: Record<string, number> = {};
    for (const { verdict, createdAt } of all) {
      const date = createdAt.toISOString().split('T')[0];
      groups[date] ??= 0;
      if (verdict === true) {
        groups[date]++;
      }
    }

    return groups;
  }

  async findProblemByIdAndUser(
    problemId: number,
    userId: number,
    opts: { includeSolved: boolean },
  ): Promise<GeneratedProblem> {
    const filter = opts.includeSolved ? {} : { verdict: null };
    return await this.prisma.generatedProblem.findUniqueOrThrow({
      where: {
        id: problemId,
        userAssignedId: userId,
        ...filter,
      },
    });
  }

  async judgeProblem(
    user: User,
    problemId: number,
    problemSolution: string,
  ): Promise<SolutionVerdict> {
    const problem = await this.findProblemByIdAndUser(problemId, user.id, {
      includeSolved: false,
    });
    const generator = await this.prisma.problemGenerator.findUniqueOrThrow({
      where: {
        id: problem.problemGeneratorId,
      },
    });

    const { checkSolution, problemContentParser } =
      problemGenerators[generator.name];

    try {
      const verdict = checkSolution(
        problemSolution,
        problemContentParser.parse(problem.content),
      );
      await this.problemSetVerdict(problem, verdict === 'ok');
      return verdict;
    } catch {
      throw new SolutionCannotBeProcessed();
    }
  }

  private async problemSetVerdict(
    problem: GeneratedProblem,
    verdict: boolean,
  ): Promise<void> {
    await this.prisma.generatedProblem.update({
      where: { id: problem.id },
      data: { verdict },
    });
  }
}
