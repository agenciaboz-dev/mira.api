-- DropIndex
DROP INDEX `addresses_user_fkey` ON `addresses`;

-- DropIndex
DROP INDEX `cards_user_fkey` ON `cards`;

-- DropIndex
DROP INDEX `orders_user_id_fkey` ON `orders`;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `address_id` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `cards` ADD CONSTRAINT `cards_user_fkey` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_user_fkey` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ordersToproducts` ADD CONSTRAINT `_ordersToproducts_A_fkey` FOREIGN KEY (`A`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ordersToproducts` ADD CONSTRAINT `_ordersToproducts_B_fkey` FOREIGN KEY (`B`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
