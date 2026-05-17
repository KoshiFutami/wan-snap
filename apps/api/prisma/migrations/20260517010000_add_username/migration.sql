-- Add username column (nullable first to populate existing rows)
ALTER TABLE `users` ADD COLUMN `username` VARCHAR(30) NULL;

-- Populate existing users with a username derived from their UUID
UPDATE `users` SET `username` = CONCAT('wan_', LOWER(SUBSTRING(REPLACE(`id`, '-', ''), 1, 10)));

-- Make column NOT NULL and add unique index
ALTER TABLE `users` MODIFY COLUMN `username` VARCHAR(30) NOT NULL;
ALTER TABLE `users` ADD UNIQUE INDEX `users_username_key`(`username`);
