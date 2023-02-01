/*
  Warnings:

  - Made the column `productId` on table `Price` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Price` DROP FOREIGN KEY `Price_productId_fkey`;

-- AlterTable
ALTER TABLE `Price` MODIFY `productId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Price` ADD CONSTRAINT `Price_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
