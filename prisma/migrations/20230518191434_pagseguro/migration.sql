-- DropIndex
DROP INDEX `addresses_user_fkey` ON `addresses`;

-- DropIndex
DROP INDEX `cards_user_fkey` ON `cards`;

-- CreateTable
CREATE TABLE `pagseguro` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `private` TEXT NOT NULL,
    `public` TEXT NOT NULL,
    `timestamp` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cards` ADD CONSTRAINT `cards_user_fkey` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_user_fkey` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
