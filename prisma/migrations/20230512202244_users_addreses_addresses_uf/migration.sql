/*
  Warnings:

  - You are about to alter the column `uf` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(2)`.

*/
-- DropIndex
DROP INDEX `addresses_user_fkey` ON `addresses`;

-- AlterTable
ALTER TABLE `addresses` MODIFY `uf` CHAR(2) NOT NULL;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_user_fkey` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
