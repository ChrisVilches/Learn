/*
  Warnings:

  - You are about to drop the column `solved` on the `GeneratedProblem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GeneratedProblem" DROP COLUMN "solved",
ADD COLUMN     "verdict" BOOLEAN;
