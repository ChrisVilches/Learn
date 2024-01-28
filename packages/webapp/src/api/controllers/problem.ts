import {
  Body,
  Controller,
  Get,
  Param,
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
import { SolutionVerdict } from 'problem-generator/dist/types/solution';
import { ProblemSolutionOptions } from 'problem-generator/dist/types/problem';
import { JwtAuthGuard } from '../../auth/guards/jwt';

@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(new ErrorMappingInterceptor())
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Get('/new-problem/:category_slug')
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
}
