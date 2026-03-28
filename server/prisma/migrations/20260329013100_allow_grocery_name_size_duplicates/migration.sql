-- DropIndex
DROP INDEX "grocery_items_name_key";

-- Update existing rows so size can participate in the composite unique constraint
UPDATE "grocery_items"
SET "size" = ''
WHERE "size" IS NULL;

-- AlterTable
ALTER TABLE "grocery_items"
ALTER COLUMN "size" SET DEFAULT '',
ALTER COLUMN "size" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "grocery_items_name_size_key" ON "grocery_items"("name", "size");
