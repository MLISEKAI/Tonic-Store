-- AlterTable
ALTER TABLE `User` ADD COLUMN `deletedAt` DATETIME(3) NULL;
ALTER TABLE `User` ADD COLUMN `deletedBy` INTEGER NULL;

-- CreateIndex
CREATE INDEX `User_deletedAt_idx` ON `User`(`deletedAt`);
CREATE INDEX `User_deletedBy_idx` ON `User`(`deletedBy`);

