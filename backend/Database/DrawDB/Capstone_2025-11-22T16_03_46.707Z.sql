CREATE TABLE IF NOT EXISTS `user` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`email` VARCHAR(255) NOT NULL UNIQUE,
	`password` VARCHAR(255) NOT NULL,
	`role` ENUM('admin', 'user') NOT NULL,
	`gaya_belajar` ENUM('consistent', 'fast', 'reflective', 'balanced') NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS `test` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`nama` VARCHAR(255) NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS `soal` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`pertanyaan` TEXT NOT NULL,
	`test_id` INTEGER NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS `pilihan` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`soal_id` INTEGER NOT NULL,
	`isi` TEXT NOT NULL,
	`bobot_consistent_learner` INTEGER NOT NULL,
	`bobot_fast_learner` INTEGER NOT NULL,
	`bobot_reflective_learner` INTEGER NOT NULL,
	`bobot_balanced_learner` INTEGER NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS `hasil_test` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`test_id` INTEGER NOT NULL,
	`user_id` INTEGER NOT NULL,
	`total_bobot_consistent_learner` INTEGER NOT NULL,
	`total_bobot_fast_learner` INTEGER NOT NULL,
	`total_bobot_reflective_learner` INTEGER NOT NULL,
	`total_bobot_balanced_learner` INTEGER NOT NULL,
	`timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`)
);


ALTER TABLE `soal`
ADD FOREIGN KEY(`test_id`) REFERENCES `test`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `pilihan`
ADD FOREIGN KEY(`soal_id`) REFERENCES `soal`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `hasil_test`
ADD FOREIGN KEY(`test_id`) REFERENCES `test`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `hasil_test`
ADD FOREIGN KEY(`user_id`) REFERENCES `user`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;