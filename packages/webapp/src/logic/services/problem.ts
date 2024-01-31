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
