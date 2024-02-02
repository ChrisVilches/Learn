import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ErrorMappingInterceptor } from '../interceptors/error-mapping';
import { CategoryFromSlugPipe } from '../pipes/category-from-slug';
import {
  NewProblemRequestOptions,
  newProblemRequestOptionsSchema,
} from '../schemas/new-problem-request-options';
import { ZodPipe } from '../pipes/zod';
import {
  ProblemSolution,
  problemSolutionSchema,
} from '../schemas/problem-solution';
import { ProblemService } from '../../logic/services/problem';
import { Category, type GeneratedProblem } from '@prisma/client';
import { SolutionVerdict } from 'problem-generator';
import { ProblemSolutionOptions } from 'problem-generator';
import { JwtAuthGuard } from '../../auth/guards/jwt';
import { CategoryService } from '../../logic/services/category';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(new ErrorMappingInterceptor())
export class ProblemController {
  constructor(
    private readonly problemService: ProblemService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get('/new-problem/:category_slug')
  @ApiOperation({ summary: 'Generate a new problem' })
  async newProblem(
    @Req() { user },
    @Query(new ZodPipe(newProblemRequestOptionsSchema))
    { difficulty }: NewProblemRequestOptions,
    @Param('category_slug', CategoryFromSlugPipe) category: Category,
  ): Promise<
    Pick<GeneratedProblem, 'id' | 'tex' | 'difficulty'> & ProblemSolutionOptions
  > {
    const result = await this.problemService.generateProblem(
      user,
      difficulty,
      category,
    );

    return {
      id: result.id,
      tex: result.tex,
      difficulty: result.difficulty,
      freeInput: result.freeInput,
      choiceAnswers: result.choiceAnswers,
    };
  }

  @Post('/judge-problem')
  @ApiOperation({ summary: 'Judge/verify a problem solution' })
  async judgeSolution(
    @Req() { user },
    @Body(new ZodPipe(problemSolutionSchema))
    { problemId, solution }: ProblemSolution,
  ): Promise<{ verdict: SolutionVerdict }> {
    return {
      verdict: await this.problemService.judgeProblem(
        user,
        problemId,
        solution,
      ),
    };
  }

  @Get('/problem-help')
  @ApiOperation({ summary: 'Gets a hint to solve the problem' })
  async getProblemHelp(
    @Req() { user },
    @Query('id', ParseIntPipe) problemId,
  ): Promise<{ help: string }> {
    const problem = await this.problemService.findProblemByIdAndUser(
      problemId,
      user.id,
      { includeSolved: true },
    );

    const { help } = await this.categoryService.findGeneratorById(
      problem.problemGeneratorId,
    );

    return {
      help: help ?? '',
    };
  }
}
