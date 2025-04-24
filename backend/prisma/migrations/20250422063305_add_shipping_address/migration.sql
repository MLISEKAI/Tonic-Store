-- AlterTable
ALTER TABLE `Order` ADD COLUMN `shippingAddressId` INTEGER NULL;

-- CreateTable
CREATE TABLE `ShippingAddress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ShippingAddress_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Order_shippingAddressId_idx` ON `Order`(`shippingAddressId`);

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_shippingAddressId_fkey` FOREIGN KEY (`shippingAddressId`) REFERENCES `ShippingAddress`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShippingAddress` ADD CONSTRAINT `ShippingAddress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
