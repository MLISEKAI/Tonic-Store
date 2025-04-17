/*
  Warnings:

  - Added the required column `shippingAddress` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingPhone` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `note` VARCHAR(191) NULL,
    ADD COLUMN `shippingAddress` VARCHAR(191) NOT NULL,
    ADD COLUMN `shippingName` VARCHAR(191) NOT NULL,
    ADD COLUMN `shippingPhone` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `Payment` ADD COLUMN `amount` DOUBLE NOT NULL,
    ADD COLUMN `currency` VARCHAR(191) NOT NULL DEFAULT 'VND',
    ADD COLUMN `paymentDate` DATETIME(3) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `method` ENUM('CREDIT_CARD', 'PAYPAL', 'VN_PAY', 'COD', 'BANK_TRANSFER') NOT NULL,
    MODIFY `status` ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED') NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX `Payment_orderId_idx` ON `Payment`(`orderId`);
