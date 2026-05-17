ALTER TABLE `dogs`
    ADD COLUMN `breed_id` VARCHAR(191) NULL;

INSERT INTO `breeds` (`id`, `name`, `created_at`)
SELECT UUID(), `missing_breeds`.`breed`, CURRENT_TIMESTAMP(3)
FROM (
    SELECT DISTINCT `breed`
    FROM `dogs`
    WHERE TRIM(`breed`) <> ''
) AS `missing_breeds`
LEFT JOIN `breeds` ON `breeds`.`name` = `missing_breeds`.`breed`
WHERE `breeds`.`id` IS NULL;

UPDATE `dogs`
INNER JOIN `breeds` ON `breeds`.`name` = `dogs`.`breed`
SET `dogs`.`breed_id` = `breeds`.`id`
WHERE `dogs`.`breed_id` IS NULL;

ALTER TABLE `dogs`
    MODIFY `breed_id` VARCHAR(191) NOT NULL;

CREATE INDEX `dogs_breed_id_idx` ON `dogs`(`breed_id`);

ALTER TABLE `dogs`
    ADD CONSTRAINT `dogs_breed_id_fkey`
    FOREIGN KEY (`breed_id`) REFERENCES `breeds`(`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;
