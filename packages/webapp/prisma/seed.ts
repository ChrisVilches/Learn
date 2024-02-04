import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { AuthModule } from '../src/auth/auth-module';
import { AuthService } from '../src/auth/services/auth';
import { INestApplication } from '@nestjs/common';

// TODO: Seed the help as well.

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
            help: 'Type the matrix using only numbers, such as: 1 2 3\n4 5 6',
          },
          {
            name: 'matrix-inversion',
            help: 'Example of allowed syntax: (1/2) * [[1, 2, 3], [4, 5, 6]]',
          },
          { name: 'matrix-rank', help: 'Type the rank of the matrix' },
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
        create: [{ name: 'quadratic-equation' }, { name: 'linear-equation' }],
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
