/*
  Warnings:

  - You are about to alter the column `price` on the `Quantity` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Quantity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quantity" TEXT NOT NULL,
    "quantityId" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    CONSTRAINT "Quantity_quantityId_fkey" FOREIGN KEY ("quantityId") REFERENCES "Size" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Quantity" ("id", "price", "quantity", "quantityId") SELECT "id", "price", "quantity", "quantityId" FROM "Quantity";
DROP TABLE "Quantity";
ALTER TABLE "new_Quantity" RENAME TO "Quantity";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
