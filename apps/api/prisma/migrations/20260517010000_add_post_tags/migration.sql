CREATE TABLE `post_tags` (
    `post_id` VARCHAR(191) NOT NULL,
    `tag` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `post_tags_tag_idx`(`tag`),
    INDEX `post_tags_tag_post_id_idx`(`tag`, `post_id`),
    PRIMARY KEY (`post_id`, `tag`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `post_tags`
    ADD CONSTRAINT `post_tags_post_id_fkey`
    FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO `post_tags` (`post_id`, `tag`, `created_at`)
SELECT DISTINCT
    `posts`.`id`,
    TRIM(`tag_rows`.`tag`) AS `tag`,
    `posts`.`created_at`
FROM `posts`
JOIN JSON_TABLE(
    `posts`.`tags`,
    '$[*]' COLUMNS (
        `tag` VARCHAR(50) PATH '$'
    )
) AS `tag_rows`
WHERE `tag_rows`.`tag` IS NOT NULL
  AND CHAR_LENGTH(TRIM(`tag_rows`.`tag`)) > 0;

ALTER TABLE `posts` DROP COLUMN `tags`;
