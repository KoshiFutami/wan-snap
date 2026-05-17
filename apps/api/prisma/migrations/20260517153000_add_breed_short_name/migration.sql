ALTER TABLE `breeds`
    ADD COLUMN `short_name` VARCHAR(100) NULL AFTER `name`;

UPDATE `breeds`
SET `short_name` = CASE `name`
  WHEN 'トイプードル' THEN 'トイプー'
  WHEN 'ミニチュアプードル' THEN 'ミニプー'
  WHEN 'スタンダードプードル' THEN 'スタンプー'
  WHEN 'フレンチブルドッグ' THEN 'フレブル'
  WHEN 'ミニチュアダックスフンド' THEN 'ミニダックス'
  WHEN 'カニンヘンダックスフンド' THEN 'カニヘン'
  WHEN 'ゴールデンレトリバー' THEN 'ゴールデン'
  WHEN 'ラブラドールレトリバー' THEN 'ラブラドール'
  WHEN 'ヨークシャーテリア' THEN 'ヨーキー'
  WHEN 'ウェルシュコーギー' THEN 'コーギー'
  WHEN 'シェットランドシープドッグ' THEN 'シェルティ'
  WHEN 'ジャックラッセルテリア' THEN 'ジャック'
  WHEN 'ビションフリーゼ' THEN 'ビション'
  WHEN 'ミニチュアシュナウザー' THEN 'ミニシュナ'
  WHEN 'ウェストハイランドホワイトテリア' THEN 'ウェスティ'
  WHEN 'スコティッシュテリア' THEN 'スコッチ'
  WHEN 'ジャーマンシェパード' THEN 'シェパード'
  WHEN 'バーニーズマウンテンドッグ' THEN 'バーニーズ'
  WHEN 'イタリアングレーハウンド' THEN 'イタグレ'
  WHEN 'ミックス犬（雑種）' THEN 'ミックス'
  ELSE `name`
END
WHERE `short_name` IS NULL;

ALTER TABLE `breeds`
    MODIFY `short_name` VARCHAR(100) NOT NULL;
