import { Injectable, PipeTransform } from '@nestjs/common';
import { CategorySlug, categorySlugSchema } from '../schemas/category-slug';
import { Category } from '@prisma/client';
import { CategoryService } from 'src/logic/services/category';

@Injectable()
export class CategoryFromSlugPipe
  implements PipeTransform<unknown, Promise<Category>>
{
  constructor(private readonly categoryService: CategoryService) {}

  async transform(value: unknown): Promise<Category> {
    const categorySlug: CategorySlug = categorySlugSchema.parse(value);
    return this.categoryService.fetchCategory(categorySlug);
  }
}
