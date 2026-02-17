-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "author" TEXT,
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "serving_size" INTEGER NOT NULL DEFAULT 1;
