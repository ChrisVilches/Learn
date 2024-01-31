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
import { Category, CategoryPreferences } from '@prisma/client';
import { CategoryService } from '../../logic/services/category';
import { JwtAuthGuard } from '../../auth/guards/jwt';
import { ZodPipe } from '../pipes/zod';
import {
  CategoryPreferencesConfig,
  categoryPreferencesConfigSchema,
} from '../../logic/schemas/category-preferences';

@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(new ErrorMappingInterceptor())
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/category/:category_slug')
  async getCategory(
    @Req() { user },
    @Param('category_slug', CategoryFromSlugPipe) category: Category,
  ): Promise<
    Category & { preferences: Pick<CategoryPreferences, 'difficulty'> }
  > {
    const preferences = await this.categoryService.fetchUserPreferences(
      user.id,
      category.id,
    );

    return { ...category, preferences };
  }

  @Put('/category/:category_slug/preferences')
  async setCategoryPreferences(
    @Req() { user },
    @Param('category_slug', CategoryFromSlugPipe) category: Category,
    @Body(new ZodPipe(categoryPreferencesConfigSchema))
    payload: CategoryPreferencesConfig,
  ) {
    return await this.categoryService.setCategoryPreferences(
      user.id,
      category.id,
      payload.difficulty,
    );
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
  ) {
    return await this.categoryService.toggleEnabledGenerator(
      user,
      generatorId,
      enable,
    );
  }
}
