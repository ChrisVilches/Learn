import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main(): Promise<void> {
  const defaultUser = await prisma.user.upsert({
    where: { email: 'dummy@gmail.com' },
    update: {},
    create: {
      email: 'dummy@gmail.com',
      userName: 'DefaultDummy',
    },
  });

  await prisma.category.upsert({
    where: { slug: 'linalg' },
    update: {},
    create: {
      slug: 'linalg',
      problemGenerators: {
        create: [
          { name: 'matrix-basic' },
          { name: 'matrix-inversion' },
          { name: 'matrix-rank' },
        ],
      },
    },
  });

  await prisma.category.upsert({
    where: { slug: 'calculus' },
    update: {},
    create: {
      slug: 'calculus',
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
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
