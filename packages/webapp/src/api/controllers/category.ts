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
  Req,
} from '@nestjs/common';
import { ErrorMappingInterceptor } from '../interceptors/error-mapping';
import { CategoryFromSlugPipe } from '../pipes/category-from-slug';
import { Category } from '@prisma/client';
import {
  CategoryService,
  ProblemGeneratorWithEnabled,
} from '../../logic/services/category';
import { JwtAuthGuard } from '../../auth/guards/jwt';

@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(new ErrorMappingInterceptor())
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/category/:category_slug')
  getCategory(
    @Param('category_slug', CategoryFromSlugPipe) category: Category,
  ): Category {
    return category;
  }

  @Get('/categories')
  async getCategories(): Promise<Category[]> {
    return await this.categoryService.fetchAllCategories();
  }

  @Get('/category/:category_slug/enabled-generators')
  async getCategoryEnabledGenerators(
    @Req() { user },
    @Param('category_slug', CategoryFromSlugPipe) category: Category,
  ) {
    return await this.categoryService.fetchUserGenerators(user, category);
  }

  @Put('/toggle-generator/:problem_generator_id')
  async toggleEnabledGenerator(
    @Req() { user },
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
