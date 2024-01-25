import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma';
import {
  type User,
  type Category,
  type ProblemGenerator,
} from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async fetchUserGenerators(
    user: User,
    category: Category,
  ): Promise<Array<Pick<ProblemGenerator, 'id' | 'name'>>> {
    return await this.prisma.problemGenerator.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        categoryId: category.id,
        users: {
          some: {
            userId: user.id,
          },
        },
      },
    });
  }

  async pickRandomSelectedGenerator(
    user: User,
    category: Category,
  ): Promise<Pick<ProblemGenerator, 'id' | 'name'>> {
    const all = await this.fetchUserGenerators(user, category);
    // TODO: annoying boilerplate for a simple array sample code.
    const idx = Math.floor(Math.random() * all.length);
    // TODO: Remove this.
    if (idx === undefined || idx === null || typeof idx === 'undefined') {
      throw new Error('BAD INDEX!!!');
    }
    return all[idx];
  }

  async fetchCategoryGenerators(
    category: Category,
  ): Promise<Array<Pick<ProblemGenerator, 'id' | 'name'>>> {
    return await this.prisma.problemGenerator.findMany({
      select: { id: true, name: true },
      where: { categoryId: category.id },
    });
  }

  async addSelectedGenerator(
    user: User,
    generatorId: number,
  ): Promise<ProblemGenerator> {
    const generator = await this.prisma.problemGenerator.findUniqueOrThrow({
      where: { id: generatorId },
    });

    try {
      await this.prisma.usersOnProblemGenerators.create({
        data: {
          user: { connect: { id: user.id } },
          problemGenerator: { connect: { id: generatorId } },
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        return generator;
      }

      throw e;
    }

    return generator;
  }

  // TODO: Unselect generator service and controller

  async fetchAllCategories(): Promise<Category[]> {
    return await this.prisma.category.findMany();
  }

  async fetchCategory(slug: string): Promise<Category> {
    return await this.prisma.category.findFirstOrThrow({ where: { slug } });
  }
}
