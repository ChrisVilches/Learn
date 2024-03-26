import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma';
import {
  type User,
  type Category,
  type ProblemGenerator,
  CategoryPreferences,
} from '@prisma/client';
import { sample, omitBy, isNil } from 'lodash';
import { categoryPreferencesConfigSchema } from '../schemas/category-preferences';

type ProblemGeneratorWithEnabled = Pick<
  ProblemGenerator,
  'id' | 'name' | 'freeInputHelp'
> & {
  enabled: boolean;
};

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findGeneratorById(id: number): Promise<ProblemGenerator> {
    return await this.prisma.problemGenerator.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async fetchUserGenerators(
    user: User,
    category: Category,
  ): Promise<Array<ProblemGeneratorWithEnabled>> {
    const all = await this.fetchCategoryGenerators(category);

    const enabled = await this.prisma.problemGenerator.findMany({
      select: { id: true },
      where: {
        categoryId: category.id,
        users: {
          some: {
            userId: user.id,
          },
        },
      },
    });

    const enabledIds = new Set(enabled.map((g) => g.id));

    return all.map((g) => ({ ...g, enabled: enabledIds.has(g.id) }));
  }

  async setCategoryPreferences(
    userId: number,
    categoryId: number,
    difficulty?: number,
  ) {
    const validData = categoryPreferencesConfigSchema.parse({
      difficulty,
    });

    const data = omitBy(validData, isNil);

    const createData = Object.assign(this.defaultCategoryPreferences(), data);

    return await this.prisma.categoryPreferences.upsert({
      where: {
        userId_categoryId: {
          userId: userId,
          categoryId,
        },
      },
      update: data,
      create: {
        user: { connect: { id: userId } },
        category: { connect: { id: categoryId } },
        ...createData,
      },
    });
  }

  async fetchUserPreferences(
    userId: number,
    categoryId: number,
  ): Promise<Pick<CategoryPreferences, 'difficulty'>> {
    const preferences = await this.prisma.categoryPreferences.findUnique({
      select: { difficulty: true },
      where: {
        userId_categoryId: {
          userId,
          categoryId,
        },
      },
    });

    return preferences ?? this.defaultCategoryPreferences();
  }

  private defaultCategoryPreferences(): Pick<
    CategoryPreferences,
    'difficulty'
  > {
    return { difficulty: 10 };
  }

  async pickRandomSelectedGenerator(
    user: User,
    category: Category,
  ): Promise<ProblemGeneratorWithEnabled> {
    const generators = await this.fetchUserGenerators(user, category);
    const enabled = generators.filter((g) => g.enabled);

    const result = enabled.length > 0 ? sample(enabled) : sample(generators);

    return result!;
  }

  private async fetchCategoryGenerators(
    category: Category,
  ): Promise<Array<Pick<ProblemGenerator, 'id' | 'name' | 'freeInputHelp'>>> {
    return await this.prisma.problemGenerator.findMany({
      select: { id: true, name: true, freeInputHelp: true },
      where: { categoryId: category.id },
    });
  }

  async toggleEnabledGenerator(
    user: User,
    generatorId: number,
    enable: boolean,
  ): Promise<ProblemGeneratorWithEnabled> {
    const generator = await this.prisma.problemGenerator.findUniqueOrThrow({
      select: { id: true, name: true, freeInputHelp: true },
      where: { id: generatorId },
    });

    if (enable) {
      await this.prisma.usersOnProblemGenerators.upsert({
        where: {
          userId_problemGeneratorId: {
            userId: user.id,
            problemGeneratorId: generatorId,
          },
        },
        update: {},
        create: {
          user: { connect: { id: user.id } },
          problemGenerator: { connect: { id: generatorId } },
        },
      });
    } else {
      await this.prisma.usersOnProblemGenerators.deleteMany({
        where: {
          userId: user.id,
          problemGeneratorId: generatorId,
        },
      });
    }

    return { ...generator, enabled: enable };
  }

  async fetchAllCategories(): Promise<Category[]> {
    return await this.prisma.category.findMany();
  }

  async fetchCategory(slug: string): Promise<Category> {
    return await this.prisma.category.findUniqueOrThrow({ where: { slug } });
  }
}
