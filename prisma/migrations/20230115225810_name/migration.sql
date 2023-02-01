-- DropForeignKey
ALTER TABLE `Price` DROP FOREIGN KEY `Price_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Price` DROP FOREIGN KEY `Price_quantityId_fkey`;

-- DropForeignKey
ALTER TABLE `Price` DROP FOREIGN KEY `Price_sizeId_fkey`;

-- AddForeignKey
ALTER TABLE `Price` ADD CONSTRAINT `Price_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `Size`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Price` ADD CONSTRAINT `Price_quantityId_fkey` FOREIGN KEY (`quantityId`) REFERENCES `Quantity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Price` ADD CONSTRAINT `Price_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
