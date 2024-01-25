import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ErrorMappingInterceptor } from './interceptors/error-mapping';
import { AuthGuard } from './guards/auth';
import { CategoryFromSlugPipe } from './pipes/category-from-slug';
import {
  NewProblemRequestOptions,
  newProblemRequestOptionsSchema,
} from './schemas/new-problem-request-options';
import { ZodPipe } from './pipes/zod';
import { CurrentUser } from './decorators/current-user';
import {
  ProblemSolution,
  problemSolutionSchema,
} from './schemas/problem-solution';
import { ProblemService } from './../logic/services/problem';
import {
  Category,
  GeneratedProblem,
  ProblemGenerator,
  User,
} from '@prisma/client';
import { CategoryService } from 'src/logic/services/category';

@Controller()
@UseGuards(AuthGuard)
@UseInterceptors(new ErrorMappingInterceptor())
export class ApiController {
  constructor(
    private readonly problemService: ProblemService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get('/me')
  async me(@CurrentUser() user: User) {
    return user;
  }

  @Get('/new-problem/:category_slug')
  async newProblem(
    @CurrentUser() user: User,
    @Query(new ZodPipe(newProblemRequestOptionsSchema))
    { difficulty }: NewProblemRequestOptions,
    @Param('category_slug', CategoryFromSlugPipe) category: Category,
  ): Promise<GeneratedProblem> {
    return await this.problemService.generateProblem(
      user,
      difficulty,
      category,
    );
  }

  @Post('/judge-problem')
  judgeSolution(
    @CurrentUser() user: User,
    @Body(new ZodPipe(problemSolutionSchema))
    { problemId, solution }: ProblemSolution,
  ) {
    return this.problemService.judgeProblem(user, problemId, solution);
  }

  // TODO: Move these to another controller.

  @Get('/categories')
  getCategories(): Promise<Category[]> {
    return this.categoryService.fetchAllCategories();
  }

  @Get('/category/:category_slug/generators')
  getCategoryGenerators(
    @Param('category_slug', CategoryFromSlugPipe) category: Category,
  ) {
    return this.categoryService.fetchCategoryGenerators(category);
  }

  @Get('/category/:category_slug/selected-generators')
  getCategorySelectedGenerators(
    @CurrentUser() user: User,
    @Param('category_slug', CategoryFromSlugPipe) category: Category,
  ) {
    return this.categoryService.fetchUserGenerators(user, category);
  }

  @Put('/select-generator/:problem_generator_id')
  addSelectedGenerator(
    @CurrentUser() user: User,
    @Param('problem_generator_id', ParseIntPipe) generatorId: number,
  ): Promise<ProblemGenerator> {
    return this.categoryService.addSelectedGenerator(user, generatorId);
  }
}
