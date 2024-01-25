/*
  Warnings:

  - You are about to drop the `Generator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsersOnGenerators` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Generator" DROP CONSTRAINT "Generator_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnGenerators" DROP CONSTRAINT "UsersOnGenerators_generatorId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnGenerators" DROP CONSTRAINT "UsersOnGenerators_userId_fkey";

-- DropTable
DROP TABLE "Generator";

-- DropTable
DROP TABLE "UsersOnGenerators";

-- CreateTable
CREATE TABLE "ProblemGenerator" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProblemGenerator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersOnProblemGenerators" (
    "userId" INTEGER NOT NULL,
    "generatorId" INTEGER NOT NULL,

    CONSTRAINT "UsersOnProblemGenerators_pkey" PRIMARY KEY ("userId","generatorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProblemGenerator_name_key" ON "ProblemGenerator"("name");

-- AddForeignKey
ALTER TABLE "ProblemGenerator" ADD CONSTRAINT "ProblemGenerator_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnProblemGenerators" ADD CONSTRAINT "UsersOnProblemGenerators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnProblemGenerators" ADD CONSTRAINT "UsersOnProblemGenerators_generatorId_fkey" FOREIGN KEY ("generatorId") REFERENCES "ProblemGenerator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
