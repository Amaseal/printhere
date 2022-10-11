/*
  Warnings:

  - You are about to drop the column `productId` on the `Quantity` table. All the data in the column will be lost.
  - Added the required column `quantityId` to the `Quantity` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Quantity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quantity" TEXT NOT NULL,
    "quantityId" INTEGER NOT NULL,
    "price" DECIMAL NOT NULL,
    CONSTRAINT "Quantity_quantityId_fkey" FOREIGN KEY ("quantityId") REFERENCES "Size" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Quantity" ("id", "price", "quantity") SELECT "id", "price", "quantity" FROM "Quantity";
DROP TABLE "Quantity";
ALTER TABLE "new_Quantity" RENAME TO "Quantity";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
