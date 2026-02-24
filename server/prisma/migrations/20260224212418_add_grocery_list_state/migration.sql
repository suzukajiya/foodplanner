-- CreateTable
CREATE TABLE "grocery_list_states" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grocery_list_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grocery_list_entries" (
    "id" TEXT NOT NULL,
    "state_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "note" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "grocery_list_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "grocery_list_entries_state_id_item_id_key" ON "grocery_list_entries"("state_id", "item_id");

-- AddForeignKey
ALTER TABLE "grocery_list_entries" ADD CONSTRAINT "grocery_list_entries_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "grocery_list_states"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grocery_list_entries" ADD CONSTRAINT "grocery_list_entries_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "grocery_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
