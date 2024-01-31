-- CreateTable
CREATE TABLE "CategoryPreferences" (
    "userId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "difficulty" INTEGER NOT NULL,

    CONSTRAINT "CategoryPreferences_pkey" PRIMARY KEY ("userId","categoryId")
);

-- AddForeignKey
ALTER TABLE "CategoryPreferences" ADD CONSTRAINT "CategoryPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryPreferences" ADD CONSTRAINT "CategoryPreferences_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
