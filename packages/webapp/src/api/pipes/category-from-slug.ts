import { Injectable, type PipeTransform } from '@nestjs/common';
import {
  type CategorySlug,
  categorySlugSchema,
} from '../schemas/category-slug';
import { type Category } from '@prisma/client';
import { CategoryService } from 'src/logic/services/category';

@Injectable()
export class CategoryFromSlugPipe
  implements PipeTransform<unknown, Promise<Category>>
{
  constructor(private readonly categoryService: CategoryService) {}

  async transform(value: unknown): Promise<Category> {
    const categorySlug: CategorySlug = categorySlugSchema.parse(value);
    return await this.categoryService.fetchCategory(categorySlug);
  }
}
