-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedProblem" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "generatorName" TEXT NOT NULL,
    "tex" TEXT NOT NULL,
    "debugInformation" TEXT,
    "userAssignedId" INTEGER NOT NULL,

    CONSTRAINT "GeneratedProblem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "GeneratedProblem" ADD CONSTRAINT "GeneratedProblem_userAssignedId_fkey" FOREIGN KEY ("userAssignedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
