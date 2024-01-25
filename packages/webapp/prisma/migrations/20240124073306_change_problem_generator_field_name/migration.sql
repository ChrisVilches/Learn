/*
  Warnings:

  - The primary key for the `UsersOnProblemGenerators` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `generatorId` on the `UsersOnProblemGenerators` table. All the data in the column will be lost.
  - Added the required column `problemGeneratorId` to the `UsersOnProblemGenerators` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UsersOnProblemGenerators" DROP CONSTRAINT "UsersOnProblemGenerators_generatorId_fkey";

-- AlterTable
ALTER TABLE "UsersOnProblemGenerators" DROP CONSTRAINT "UsersOnProblemGenerators_pkey",
DROP COLUMN "generatorId",
ADD COLUMN     "problemGeneratorId" INTEGER NOT NULL,
ADD CONSTRAINT "UsersOnProblemGenerators_pkey" PRIMARY KEY ("userId", "problemGeneratorId");

-- AddForeignKey
ALTER TABLE "UsersOnProblemGenerators" ADD CONSTRAINT "UsersOnProblemGenerators_problemGeneratorId_fkey" FOREIGN KEY ("problemGeneratorId") REFERENCES "ProblemGenerator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
