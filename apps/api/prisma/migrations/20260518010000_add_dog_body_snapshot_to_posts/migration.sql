-- 投稿時点の犬の体重・体型をスナップショットとして保存する
ALTER TABLE `posts`
  ADD COLUMN `dog_weight_kg`     DECIMAL(5,2) NULL,
  ADD COLUMN `dog_neck_cm`       DECIMAL(5,1) NULL,
  ADD COLUMN `dog_chest_cm`      DECIMAL(5,1) NULL,
  ADD COLUMN `dog_back_length_cm` DECIMAL(5,1) NULL;
