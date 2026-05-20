-- Supabase Auth への移行
-- password カラムを削除し、supabase_id カラムを追加する

ALTER TABLE `users` ADD COLUMN `supabase_id` VARCHAR(255) NOT NULL DEFAULT '' AFTER `id`;
ALTER TABLE `users` ADD UNIQUE INDEX `users_supabase_id_key` (`supabase_id`);
ALTER TABLE `users` DROP COLUMN `password`;
