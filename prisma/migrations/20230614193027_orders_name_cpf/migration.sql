-- DropIndex
DROP INDEX `addresses_user_fkey` ON `addresses`;

-- DropIndex
DROP INDEX `cards_user_fkey` ON `cards`;

-- DropIndex
DROP INDEX `orders_address_id_fkey` ON `orders`;

-- DropIndex
DROP INDEX `orders_user_id_fkey` ON `orders`;

-- DropIndex
DROP INDEX `products_supplier_id_fkey` ON `products`;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `cpf` VARCHAR(191) NOT NULL DEFAULT '00000000000',
    ADD COLUMN `name` VARCHAR(191) NOT NULL DEFAULT 'Teste da Silva';

-- AddForeignKey
ALTER TABLE `cards` ADD CONSTRAINT `cards_user_fkey` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_user_fkey` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ordersToproducts` ADD CONSTRAINT `_ordersToproducts_A_fkey` FOREIGN KEY (`A`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ordersToproducts` ADD CONSTRAINT `_ordersToproducts_B_fkey` FOREIGN KEY (`B`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_categoriesToproducts` ADD CONSTRAINT `_categoriesToproducts_A_fkey` FOREIGN KEY (`A`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_categoriesToproducts` ADD CONSTRAINT `_categoriesToproducts_B_fkey` FOREIGN KEY (`B`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
