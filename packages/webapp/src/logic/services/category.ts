import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma';
import {
  type User,
  type Category,
  type ProblemGenerator,
} from '@prisma/client';
import { arraySample } from 'src/util/misc';

export type ProblemGeneratorWithEnabled = Pick<
  ProblemGenerator,
  'id' | 'name'
> & {
  enabled: boolean;
};

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async fetchUserGenerators(
    user: User,
    category: Category,
  ): Promise<ProblemGeneratorWithEnabled[]> {
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

  async pickRandomSelectedGenerator(
    user: User,
    category: Category,
  ): Promise<ProblemGeneratorWithEnabled> {
    const generators = await this.fetchUserGenerators(user, category);
    const enabled = generators.filter((g) => g.enabled);

    if (enabled.length > 0) {
      return arraySample(enabled);
    } else {
      return arraySample(generators);
    }
  }

  private async fetchCategoryGenerators(
    category: Category,
  ): Promise<Array<Pick<ProblemGenerator, 'id' | 'name'>>> {
    return await this.prisma.problemGenerator.findMany({
      select: { id: true, name: true },
      where: { categoryId: category.id },
    });
  }

  async toggleEnabledGenerator(
    user: User,
    generatorId: number,
    enable: boolean,
  ): Promise<ProblemGeneratorWithEnabled> {
    const generator = await this.prisma.problemGenerator.findUniqueOrThrow({
      select: { id: true, name: true },
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
    return await this.prisma.category.findFirstOrThrow({ where: { slug } });
  }
}
