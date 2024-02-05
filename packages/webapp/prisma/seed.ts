import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { AuthModule } from '../src/auth/auth-module';
import { AuthService } from '../src/auth/services/auth';
import { INestApplication } from '@nestjs/common';

const prisma = new PrismaClient();
let app: INestApplication;

async function main(): Promise<void> {
  app = await NestFactory.create(AuthModule);
  const authService = await app.get(AuthService);

  const defaultUser = await authService.createNewUserRegistration(
    'dummy@gmail.com',
    'DefaultDummy',
    'pass',
  );

  await prisma.category.upsert({
    where: { slug: 'linalg' },
    update: {},
    create: {
      slug: 'linalg',
      name: 'Linear Algebra',
      description:
        'Linear algebra is the branch of mathematics concerning linear equations, linear maps and their representations in vector spaces and through matrices.',
      problemGenerators: {
        create: [
          {
            name: 'matrix-basic',
            help: 'Type the result matrix using only numbers, such as:\n```\n1 2 3\n4 5 6\n```',
          },
          {
            name: 'matrix-inversion',
            help: 'Example of allowed syntax:\n```\n(1/2) * [[1, 2, 3], [4, 5, 6]]\n```',
          },
          { name: 'matrix-rank', help: 'Enter the rank of the matrix' },
        ],
      },
    },
  });

  await prisma.category.upsert({
    where: { slug: 'calculus' },
    update: {},
    create: {
      slug: 'calculus',
      name: 'Calculus',
      description:
        'Calculus is the mathematical study of continuous change, in the same way that geometry is the study of shape, and algebra is the study of generalizations of arithmetic operations.',
      problemGenerators: {
        create: [
          { name: 'integration' },
          { name: 'single-variable-derivative' },
        ],
      },
    },
  });

  await prisma.category.upsert({
    where: { slug: 'algebra' },
    update: {},
    create: {
      slug: 'algebra',
      name: 'Algebra',
      description:
        'Algebra is the study of variables and the rules for manipulating these variables in formulas.',
      problemGenerators: {
        create: [
          {
            name: 'quadratic-equation',
            help: 'Enter two solutions separated by a comma (if they are the same, just enter one).\n\n**Example 1** (Two real solutions):\n```\n3, 4\n```\n**Example 2** (Two complex solutions):\n```\n5 - i * sqrt(3/5), 5 + i * sqrt(3/5)\n```\n**Example 3** (One solution):\n```\n6\n```',
          },
          { name: 'linear-equation' },
        ],
      },
    },
  });

  const allGenIds = (await prisma.problemGenerator.findMany()).map((g) => g.id);
  await prisma.usersOnProblemGenerators.createMany({
    data: allGenIds.map((id) => ({
      userId: defaultUser.id,
      problemGeneratorId: id,
    })),
  });
}
main()
  .catch(async (e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await app.close();
    await prisma.$disconnect();
  });
