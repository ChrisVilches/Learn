import { Injectable, type PipeTransform } from '@nestjs/common';
import { type Category } from '@prisma/client';
import { CategoryService } from '../../logic/services/category';
import { z } from 'zod';

@Injectable()
export class CategoryFromSlugPipe
  implements PipeTransform<unknown, Promise<Category>>
{
  constructor(private readonly categoryService: CategoryService) {}

  async transform(value: unknown): Promise<Category> {
    const categorySlug: string = z.string().parse(value);
    return await this.categoryService.fetchCategory(categorySlug);
  }
}
