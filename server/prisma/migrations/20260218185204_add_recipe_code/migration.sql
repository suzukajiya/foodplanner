/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `recipes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "recipes_code_key" ON "recipes"("code");
