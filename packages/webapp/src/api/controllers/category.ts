import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ErrorMappingInterceptor } from '../interceptors/error-mapping';
import { AuthGuard } from '../guards/auth';
import { CategoryFromSlugPipe } from '../pipes/category-from-slug';
import { CurrentUser } from '../decorators/current-user';
import { Category, User } from '@prisma/client';
import {
  CategoryService,
  ProblemGeneratorWithEnabled,
} from 'src/logic/services/category';

@Controller()
@UseGuards(AuthGuard)
@UseInterceptors(new ErrorMappingInterceptor())
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/categories')
  async getCategories(): Promise<Category[]> {
    return await this.categoryService.fetchAllCategories();
  }

  // @Get('/category/:category_slug/generators')
  // async getCategoryGenerators(
  //   @Param('category_slug', CategoryFromSlugPipe) category: Category,
  // ): Promise<Array<Pick<ProblemGenerator, 'id' | 'name'>>> {
  //   return await this.categoryService.fetchCategoryGenerators(category);
  // }

  @Get('/category/:category_slug/enabled-generators')
  async getCategoryEnabledGenerators(
    @CurrentUser() user: User,
    @Param('category_slug', CategoryFromSlugPipe) category: Category,
  ) {
    return await this.categoryService.fetchUserGenerators(user, category);
  }

  @Put('/toggle-generator/:problem_generator_id')
  async toggleEnabledGenerator(
    @CurrentUser() user: User,
    @Param('problem_generator_id', ParseIntPipe) generatorId: number,
    @Body('enable', ParseBoolPipe) enable: boolean,
  ): Promise<ProblemGeneratorWithEnabled> {
    return await this.categoryService.toggleEnabledGenerator(
      user,
      generatorId,
      enable,
    );
  }
}
