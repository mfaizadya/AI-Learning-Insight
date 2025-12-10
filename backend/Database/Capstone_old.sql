CREATE TABLE IF NOT EXISTS `users` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`email` VARCHAR(255) NOT NULL UNIQUE,
	`username` VARCHAR(255) NOT NULL,
	`password` VARCHAR(255) NOT NULL,
	`image` VARCHAR(255),
	`role` ENUM('admin', 'user') NOT NULL,
	`learning_style` ENUM('visual', 'auditori', 'kinestetik') NOT NULL,
	`learning_pattern` ENUM('consistent', 'fast', 'reflective', 'balanced') NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS `test_pola` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS `soal_pola` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`test_id` INTEGER NOT NULL,
	`question` TEXT NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE INDEX `idx_soal_pola_test`
ON `soal_pola` (`test_id`);
CREATE TABLE IF NOT EXISTS `pilihan_pola` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`soal_id` INTEGER NOT NULL,
	`option_text` TEXT NOT NULL,
	`bobot_consistent` INTEGER NOT NULL,
	`bobot_fast` INTEGER NOT NULL,
	`bobot_reflective` INTEGER NOT NULL,
	`bobot_balanced` INTEGER NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE INDEX `idx_pilihan_pola_soal`
ON `pilihan_pola` (`soal_id`);
CREATE TABLE IF NOT EXISTS `test_gaya` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS `soal_gaya` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`test_id` INTEGER NOT NULL,
	`question` TEXT NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE INDEX `idx_soal_gaya_test`
ON `soal_gaya` (`test_id`);
CREATE TABLE IF NOT EXISTS `pilihan_gaya` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`soal_id` INTEGER NOT NULL,
	`option_text` TEXT NOT NULL,
	`bobot_visual` INTEGER NOT NULL,
	`bobot_auditori` INTEGER NOT NULL,
	`bobot_kinestetik` INTEGER NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE INDEX `idx_pilihan_gaya_soal`
ON `pilihan_gaya` (`soal_id`);
CREATE TABLE IF NOT EXISTS `hasil_test` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`user_id` INTEGER NOT NULL,
	`test_pola_id` INTEGER,
	`test_gaya_id` INTEGER,
	`timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE INDEX `idx_hasil_user`
ON `hasil_test` (`user_id`);
CREATE INDEX `idx_hasil_test_pola`
ON `hasil_test` (`test_pola_id`);
CREATE INDEX `idx_hasil_test_gaya`
ON `hasil_test` (`test_gaya_id`);
CREATE TABLE IF NOT EXISTS `hasil_test_pola_detail` (
	`id` INTEGER AUTO_INCREMENT,
	`hasil_test_id` INTEGER NOT NULL,
	`soal_id` INTEGER NOT NULL,
	`pilihan_id` INTEGER NOT NULL,
	`bobot_consistent` INTEGER NOT NULL,
	`bobot_fast` INTEGER NOT NULL,
	`bobot_reflective` INTEGER NOT NULL,
	`bobot_balanced` INTEGER NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS `hasil_test_gaya_detail` (
	`id` INTEGER AUTO_INCREMENT,
	`hasil_test_id` INTEGER NOT NULL,
	`soal_id` INTEGER NOT NULL,
	`pilihan_id` INTEGER NOT NULL,
	`bobot_visual` INTEGER NOT NULL,
	`bobot_auditori` INTEGER NOT NULL,
	`bobot_kinestetik` INTEGER NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS `insight` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`user_id` INTEGER NOT NULL,
	`insight` TEXT NOT NULL,
	PRIMARY KEY(`id`)
);


ALTER TABLE `soal_pola`
ADD FOREIGN KEY(`test_id`) REFERENCES `test_pola`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `pilihan_pola`
ADD FOREIGN KEY(`soal_id`) REFERENCES `soal_pola`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `soal_gaya`
ADD FOREIGN KEY(`test_id`) REFERENCES `test_gaya`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `pilihan_gaya`
ADD FOREIGN KEY(`soal_id`) REFERENCES `soal_gaya`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `hasil_test`
ADD FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `hasil_test`
ADD FOREIGN KEY(`test_pola_id`) REFERENCES `test_pola`(`id`)
ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE `hasil_test`
ADD FOREIGN KEY(`test_gaya_id`) REFERENCES `test_gaya`(`id`)
ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE `hasil_test_pola_detail`
ADD FOREIGN KEY(`hasil_test_id`) REFERENCES `hasil_test`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `hasil_test_pola_detail`
ADD FOREIGN KEY(`soal_id`) REFERENCES `soal_pola`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `hasil_test_pola_detail`
ADD FOREIGN KEY(`pilihan_id`) REFERENCES `pilihan_pola`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `hasil_test_gaya_detail`
ADD FOREIGN KEY(`hasil_test_id`) REFERENCES `hasil_test`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `hasil_test_gaya_detail`
ADD FOREIGN KEY(`soal_id`) REFERENCES `soal_gaya`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `hasil_test_gaya_detail`
ADD FOREIGN KEY(`pilihan_id`) REFERENCES `pilihan_gaya`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `insight`
ADD FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;