/*
  Warnings:

  - You are about to drop the column `price` on the `Size` table. All the data in the column will be lost.
  - Added the required column `price` to the `Quantity` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Size" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "size" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "Size_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Size" ("id", "productId", "size") SELECT "id", "productId", "size" FROM "Size";
DROP TABLE "Size";
ALTER TABLE "new_Size" RENAME TO "Size";
CREATE TABLE "new_Quantity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quantity" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "price" DECIMAL NOT NULL,
    CONSTRAINT "Quantity_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Quantity" ("id", "productId", "quantity") SELECT "id", "productId", "quantity" FROM "Quantity";
DROP TABLE "Quantity";
ALTER TABLE "new_Quantity" RENAME TO "Quantity";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
