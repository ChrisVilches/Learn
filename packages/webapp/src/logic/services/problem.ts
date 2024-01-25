import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma';
import { User, Prisma, Category, GeneratedProblem } from '@prisma/client';
import {
  ForbiddenSolveProblem,
  ProblemAlreadyAttempted,
} from '../problem-errors';
import { CategoryService } from './category';
import { problemGenerators } from 'problem-generator';

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
  ): Promise<GeneratedProblem> {
    // TODO: What happens where there's no generator selected?
    const generator = await this.categoryService.pickRandomSelectedGenerator(
      user,
      category,
    );

    const { tex, debugInformation, content } =
      await problemGenerators[generator.name].fromDifficulty(difficulty);

    const data: Prisma.GeneratedProblemCreateInput = {
      difficulty,
      problemGenerator: { connect: generator },
      tex,
      debugInformation,
      userAssigned: { connect: user },
      category: { connect: category },
      content,
    };

    return await this.prisma.generatedProblem.create({
      data,
      include: { problemGenerator: { select: { id: true, name: true } } },
    });
  }

  private async findProblemById(id: number): Promise<GeneratedProblem> {
    return this.prisma.generatedProblem.findUniqueOrThrow({ where: { id } });
  }

  private async userAllowedToSolve(
    user: User,
    problem: GeneratedProblem,
  ): Promise<boolean> {
    return problem.userAssignedId === user.id;
  }

  private async judgePreCheck(user: User, problem: GeneratedProblem) {
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
  ): Promise<string> {
    const problem = await this.findProblemById(problemId);
    const generator = await this.prisma.problemGenerator.findUniqueOrThrow({
      where: {
        id: problem.problemGeneratorId,
      },
    });

    await this.judgePreCheck(user, problem);

    const { checkSolution, problemContentParser } =
      problemGenerators[generator.name];

    // TODO: If verdict is "cannot-parse" (which right now isn't very well tested)
    //       then it should skipping setting the verdict, since the user should be able
    //       to try again.
    const verdict = checkSolution(
      problemSolution,
      problemContentParser.parse(problem.content),
    );

    await this.problemSetVerdict(problem, verdict === 'ok');
    return `(ID ${problemId}) Verdict: ${verdict}`;
  }

  private async problemSetVerdict(problem: GeneratedProblem, verdict: boolean) {
    await this.prisma.generatedProblem.update({
      where: { id: problem.id },
      data: { verdict },
    });
  }
}
