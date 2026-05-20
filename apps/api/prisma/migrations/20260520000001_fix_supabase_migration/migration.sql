-- 前のマイグレーション（20260520000000）が途中で失敗した状態を修正する
-- supabase_id カラムは追加済みだが UNIQUE INDEX 未追加、password カラムが残っている

-- 既存ユーザーを全削除（Supabase アカウントなしのため再ログイン不可）
DELETE FROM `notifications`;
DELETE FROM `bookmarks`;
DELETE FROM `comments`;
DELETE FROM `likes`;
DELETE FROM `follows`;
DELETE FROM `post_groomings`;
DELETE FROM `post_items`;
DELETE FROM `post_tags`;
DELETE FROM `posts`;
DELETE FROM `dogs`;
DELETE FROM `users`;

-- UNIQUE INDEX を追加（テーブルが空なので安全）
ALTER TABLE `users` ADD UNIQUE INDEX `users_supabase_id_key` (`supabase_id`);

-- password カラムを削除（残っている場合）
ALTER TABLE `users` DROP COLUMN IF EXISTS `password`;
