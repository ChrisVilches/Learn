-- CreateTable
CREATE TABLE "Generator" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Generator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersOnGenerators" (
    "userId" INTEGER NOT NULL,
    "generatorId" INTEGER NOT NULL,

    CONSTRAINT "UsersOnGenerators_pkey" PRIMARY KEY ("userId","generatorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Generator_name_key" ON "Generator"("name");

-- AddForeignKey
ALTER TABLE "Generator" ADD CONSTRAINT "Generator_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnGenerators" ADD CONSTRAINT "UsersOnGenerators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnGenerators" ADD CONSTRAINT "UsersOnGenerators_generatorId_fkey" FOREIGN KEY ("generatorId") REFERENCES "Generator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
