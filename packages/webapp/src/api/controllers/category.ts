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
import { CategoryPreferencesConfigDto } from '../../logic/schemas/category-preferences';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(new ErrorMappingInterceptor())
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/category/:category_slug')
  @ApiOperation({ summary: 'Get problem category by slug' })
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
  @ApiOperation({ summary: 'Get user preferences on a problem category' })
  async setCategoryPreferences(
    @Req() { user },
    @Param('category_slug', CategoryFromSlugPipe) category: Category,
    @Body() payload: CategoryPreferencesConfigDto,
  ) {
    return await this.categoryService.setCategoryPreferences(
      user.id,
      category.id,
      payload.difficulty,
    );
  }

  @Get('/categories')
  @ApiOperation({ summary: 'Get list of categories' })
  async getCategories(): Promise<Category[]> {
    return await this.categoryService.fetchAllCategories();
  }

  @Get('/category/:category_slug/enabled-generators')
  @ApiOperation({
    summary:
      'Get a category problem generators, including which ones are enabled by the user',
  })
  async getCategoryEnabledGenerators(
    @Req() { user },
    @Param('category_slug', CategoryFromSlugPipe) category: Category,
  ) {
    return await this.categoryService.fetchUserGenerators(user, category);
  }

  @ApiOperation({ summary: 'Turn a problem generator ON/OFF' })
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
