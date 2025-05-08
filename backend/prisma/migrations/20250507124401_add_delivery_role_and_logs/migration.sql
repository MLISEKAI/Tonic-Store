-- AlterTable
ALTER TABLE `Order` ADD COLUMN `shipperId` INTEGER NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('CUSTOMER', 'ADMIN', 'DELIVERY') NOT NULL DEFAULT 'CUSTOMER';

-- CreateTable
CREATE TABLE `DeliveryLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `deliveryId` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED') NOT NULL,
    `note` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `DeliveryLog_orderId_idx`(`orderId`),
    INDEX `DeliveryLog_deliveryId_idx`(`deliveryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Order_shipperId_idx` ON `Order`(`shipperId`);

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_shipperId_fkey` FOREIGN KEY (`shipperId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeliveryLog` ADD CONSTRAINT `DeliveryLog_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeliveryLog` ADD CONSTRAINT `DeliveryLog_deliveryId_fkey` FOREIGN KEY (`deliveryId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
