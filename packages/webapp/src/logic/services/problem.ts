import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma';
import {
  type User,
  type Prisma,
  type Category,
  type GeneratedProblem,
} from '@prisma/client';
import {
  ForbiddenSolveProblem,
  ProblemAlreadyAttempted,
} from '../problem-errors';
import { CategoryService } from './category';
import { problemGenerators } from 'problem-generator';
import { SolutionVerdict } from 'problem-generator/dist/types/solution';
import { ProblemSolutionOptions } from 'problem-generator/dist/types/problem';

@Injectable()
export class ProblemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryService: CategoryService,
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
      userAssigned: { connect: user },
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

  private async findProblemById(id: number): Promise<GeneratedProblem> {
    return await this.prisma.generatedProblem.findUniqueOrThrow({
      where: { id },
    });
  }

  private async userAllowedToSolve(
    user: User,
    problem: GeneratedProblem,
  ): Promise<boolean> {
    return problem.userAssignedId === user.id;
  }

  private async judgePreCheck(
    user: User,
    problem: GeneratedProblem,
  ): Promise<void> {
    const allow = await this.userAllowedToSolve(user, problem);

    if (!allow) {
      throw new ForbiddenSolveProblem();
    }

    if (problem.verdict !== null) {
      throw new ProblemAlreadyAttempted();
    }
  }

  async judgeProblem(
    user: User,
    problemId: number,
    problemSolution: string,
  ): Promise<SolutionVerdict> {
    const problem = await this.findProblemById(problemId);
    const generator = await this.prisma.problemGenerator.findUniqueOrThrow({
      where: {
        id: problem.problemGeneratorId,
      },
    });

    await this.judgePreCheck(user, problem);

    const { checkSolution, problemContentParser } =
      problemGenerators[generator.name];

    const verdict = checkSolution(
      problemSolution,
      problemContentParser.parse(problem.content),
    );

    await this.problemSetVerdict(problem, verdict === 'ok');
    return verdict;
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
