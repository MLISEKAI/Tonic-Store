/*
  Warnings:

  - Added the required column `price` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CartItem` ADD COLUMN `price` DOUBLE NOT NULL DEFAULT 0;

-- Update existing cart items with product price
UPDATE `CartItem` ci 
JOIN `Product` p ON ci.productId = p.id 
SET ci.price = CASE 
  WHEN p.promotionalPrice IS NOT NULL AND p.promotionalPrice > 0 AND p.promotionalPrice < p.price 
  THEN p.promotionalPrice 
  ELSE p.price 
END;
