-- AlterTable
ALTER TABLE `Order` ADD COLUMN `discount` DOUBLE NULL,
    ADD COLUMN `promotionCode` VARCHAR(191) NULL;
