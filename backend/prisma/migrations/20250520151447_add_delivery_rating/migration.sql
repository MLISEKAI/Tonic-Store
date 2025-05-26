/*
  Warnings:

  - You are about to drop the column `shippingAddressId` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_shippingAddressId_fkey`;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `shippingAddressId`;

-- CreateTable
CREATE TABLE `DeliveryRating` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DeliveryRating_orderId_key`(`orderId`),
    INDEX `DeliveryRating_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DeliveryRating` ADD CONSTRAINT `DeliveryRating_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeliveryRating` ADD CONSTRAINT `DeliveryRating_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Order` RENAME INDEX `Order_userId_fkey` TO `Order_userId_idx`;
