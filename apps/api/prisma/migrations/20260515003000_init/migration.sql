CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `display_name` VARCHAR(100) NOT NULL,
    `avatar_url` VARCHAR(512) NULL,
    `bio` TEXT NULL,
    `location` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `dogs` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `breed` VARCHAR(100) NOT NULL,
    `birth_year` INTEGER NULL,
    `weight_kg` DECIMAL(5, 2) NULL,
    `neck_cm` DECIMAL(5, 1) NULL,
    `chest_cm` DECIMAL(5, 1) NULL,
    `back_length_cm` DECIMAL(5, 1) NULL,
    `coat_colors` JSON NOT NULL,
    `photo_url` VARCHAR(512) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `owner_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`),
    CONSTRAINT `dogs_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `posts` (
    `id` VARCHAR(191) NOT NULL,
    `image_url` VARCHAR(512) NOT NULL,
    `caption` TEXT NULL,
    `tags` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `author_id` VARCHAR(191) NOT NULL,
    `dog_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`),
    CONSTRAINT `posts_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `posts_dog_id_fkey` FOREIGN KEY (`dog_id`) REFERENCES `dogs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `post_items` (
    `id` VARCHAR(191) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `brand` VARCHAR(100) NULL,
    `product_name` VARCHAR(200) NULL,
    `size` VARCHAR(20) NULL,
    `purchase_url` VARCHAR(512) NULL,
    `price_jpy` INTEGER NULL,
    `fit_note` VARCHAR(500) NULL,
    `post_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`),
    CONSTRAINT `post_items_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `likes` (
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_id` VARCHAR(191) NOT NULL,
    `post_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`user_id`, `post_id`),
    CONSTRAINT `likes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `likes_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `follows` (
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `follower_id` VARCHAR(191) NOT NULL,
    `following_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`follower_id`, `following_id`),
    CONSTRAINT `follows_follower_id_fkey` FOREIGN KEY (`follower_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `follows_following_id_fkey` FOREIGN KEY (`following_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
