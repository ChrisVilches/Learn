/*
  Warnings:

  - You are about to drop the column `generatorName` on the `GeneratedProblem` table. All the data in the column will be lost.
  - Added the required column `problemGeneratorId` to the `GeneratedProblem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GeneratedProblem" DROP COLUMN "generatorName",
ADD COLUMN     "problemGeneratorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "GeneratedProblem" ADD CONSTRAINT "GeneratedProblem_problemGeneratorId_fkey" FOREIGN KEY ("problemGeneratorId") REFERENCES "ProblemGenerator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
