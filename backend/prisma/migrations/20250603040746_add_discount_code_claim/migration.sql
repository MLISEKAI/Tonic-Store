-- CreateTable
CREATE TABLE `DiscountCodeClaim` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `discountCodeId` INTEGER NOT NULL,
    `claimedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isUsed` BOOLEAN NOT NULL DEFAULT false,

    INDEX `DiscountCodeClaim_discountCodeId_idx`(`discountCodeId`),
    INDEX `DiscountCodeClaim_userId_idx`(`userId`),
    UNIQUE INDEX `DiscountCodeClaim_userId_discountCodeId_key`(`userId`, `discountCodeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DiscountCodeClaim` ADD CONSTRAINT `DiscountCodeClaim_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiscountCodeClaim` ADD CONSTRAINT `DiscountCodeClaim_discountCodeId_fkey` FOREIGN KEY (`discountCodeId`) REFERENCES `discount_codes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
