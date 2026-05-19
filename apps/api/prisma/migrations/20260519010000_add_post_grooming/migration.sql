-- CreateTable
CREATE TABLE `post_groomings` (
    `post_id` VARCHAR(191) NOT NULL,
    `salon_name` VARCHAR(100) NOT NULL,
    `salon_instagram` VARCHAR(100) NULL,
    `cut_style` VARCHAR(100) NULL,
    `note` VARCHAR(500) NULL,

    PRIMARY KEY (`post_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `post_groomings` ADD CONSTRAINT `post_groomings_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
