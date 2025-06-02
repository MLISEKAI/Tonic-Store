-- CreateTable
CREATE TABLE `DiscountCodeUsage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `discountCodeId` INTEGER NOT NULL,
    `orderId` INTEGER NULL,
    `usedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DiscountCodeUsage_discountCodeId_idx`(`discountCodeId`),
    UNIQUE INDEX `DiscountCodeUsage_userId_discountCodeId_key`(`userId`, `discountCodeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DiscountCodeUsage` ADD CONSTRAINT `DiscountCodeUsage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiscountCodeUsage` ADD CONSTRAINT `DiscountCodeUsage_discountCodeId_fkey` FOREIGN KEY (`discountCodeId`) REFERENCES `discount_codes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
