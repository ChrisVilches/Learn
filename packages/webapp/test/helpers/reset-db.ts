import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const resetDb = async () => {
  await prisma.$transaction([
    prisma.categoryPreferences.deleteMany(),
    prisma.usersOnProblemGenerators.deleteMany(),
    prisma.generatedProblem.deleteMany(),
    prisma.problemGenerator.deleteMany(),
    prisma.category.deleteMany(),
    prisma.user.deleteMany(),
  ]);
};
