-- phpMyAdmin SQL Dump
-- version 5.2.1
-- Generation Time: Dec 12, 2025 at 08:00 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `capstone_db`
--
CREATE DATABASE IF NOT EXISTS `capstone_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `capstone_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. BERSIHKAN TABEL LAMA
DROP TABLE IF EXISTS `motd`;
DROP TABLE IF EXISTS `insight`;
DROP TABLE IF EXISTS `hasil_test_gaya_detail`;
DROP TABLE IF EXISTS `hasil_test_pola_detail`;
DROP TABLE IF EXISTS `hasil_test`;
DROP TABLE IF EXISTS `pilihan_gaya`;
DROP TABLE IF EXISTS `pilihan_pola`;
DROP TABLE IF EXISTS `soal_gaya`;
DROP TABLE IF EXISTS `soal_pola`;
DROP TABLE IF EXISTS `test_gaya`;
DROP TABLE IF EXISTS `test_pola`;
DROP TABLE IF EXISTS `users`;

-- ========================================================
-- 2. CREATE TABLE
-- ========================================================

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `learning_style` enum('visual','auditori','kinestetik') DEFAULT NULL,
  `learning_pattern` enum('consistent','fast','reflective','balanced') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `test_pola` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `test_gaya` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `soal_pola` (
  `id` int(11) NOT NULL,
  `test_id` int(11) NOT NULL,
  `question` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `soal_gaya` (
  `id` int(11) NOT NULL,
  `test_id` int(11) NOT NULL,
  `question` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `pilihan_pola` (
  `id` int(11) NOT NULL,
  `soal_id` int(11) NOT NULL,
  `option_text` text NOT NULL,
  `bobot_consistent` float NOT NULL DEFAULT 0,
  `bobot_fast` float NOT NULL DEFAULT 0,
  `bobot_reflective` float NOT NULL DEFAULT 0,
  `bobot_balanced` float NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `pilihan_gaya` (
  `id` int(11) NOT NULL,
  `soal_id` int(11) NOT NULL,
  `option_text` text NOT NULL,
  `bobot_visual` int(11) NOT NULL DEFAULT 0,
  `bobot_auditori` int(11) NOT NULL DEFAULT 0,
  `bobot_kinestetik` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `hasil_test` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `test_pola_id` int(11) DEFAULT NULL,
  `test_gaya_id` int(11) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `hasil_test_pola_detail` (
  `id` int(11) NOT NULL,
  `hasil_test_id` int(11) NOT NULL,
  `soal_id` int(11) NOT NULL,
  `pilihan_id` int(11) NOT NULL,
  `bobot_consistent` float NOT NULL DEFAULT 0,
  `bobot_fast` float NOT NULL DEFAULT 0,
  `bobot_reflective` float NOT NULL DEFAULT 0,
  `bobot_balanced` float NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `hasil_test_gaya_detail` (
  `id` int(11) NOT NULL,
  `hasil_test_id` int(11) NOT NULL,
  `soal_id` int(11) NOT NULL,
  `pilihan_id` int(11) NOT NULL,
  `bobot_visual` int(11) NOT NULL DEFAULT 0,
  `bobot_auditori` int(11) NOT NULL DEFAULT 0,
  `bobot_kinestetik` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `insight` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `insight` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `motd` (
  `motd_id` int(11) NOT NULL,
  `message` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
--
-- Indexes for dumped tables
--

--
-- Indexes for table `hasil_test`
--
ALTER TABLE `hasil_test`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_hasil_user` (`user_id`),
  ADD KEY `idx_hasil_test_pola` (`test_pola_id`),
  ADD KEY `idx_hasil_test_gaya` (`test_gaya_id`);

--
-- Indexes for table `hasil_test_gaya_detail`
--
ALTER TABLE `hasil_test_gaya_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hasil_test_id` (`hasil_test_id`),
  ADD KEY `soal_id` (`soal_id`),
  ADD KEY `pilihan_id` (`pilihan_id`);

--
-- Indexes for table `hasil_test_pola_detail`
--
ALTER TABLE `hasil_test_pola_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hasil_test_id` (`hasil_test_id`),
  ADD KEY `soal_id` (`soal_id`),
  ADD KEY `pilihan_id` (`pilihan_id`);

--
-- Indexes for table `insight`
--
ALTER TABLE `insight`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `motd`
--
ALTER TABLE `motd`
  ADD PRIMARY KEY (`motd_id`);

--
-- Indexes for table `pilihan_gaya`
--
ALTER TABLE `pilihan_gaya`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pilihan_gaya_soal` (`soal_id`);

--
-- Indexes for table `pilihan_pola`
--
ALTER TABLE `pilihan_pola`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pilihan_pola_soal` (`soal_id`);

--
-- Indexes for table `soal_gaya`
--
ALTER TABLE `soal_gaya`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_soal_gaya_test` (`test_id`);

--
-- Indexes for table `soal_pola`
--
ALTER TABLE `soal_pola`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_soal_pola_test` (`test_id`);

--
-- Indexes for table `test_gaya`
--
ALTER TABLE `test_gaya`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `test_pola`
--
ALTER TABLE `test_pola`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `hasil_test`
--
ALTER TABLE `hasil_test`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `hasil_test_gaya_detail`
--
ALTER TABLE `hasil_test_gaya_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `hasil_test_pola_detail`
--
ALTER TABLE `hasil_test_pola_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `insight`
--
ALTER TABLE `insight`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `motd`
--
ALTER TABLE `motd`
  MODIFY `motd_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `pilihan_gaya`
--
ALTER TABLE `pilihan_gaya`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `pilihan_pola`
--
ALTER TABLE `pilihan_pola`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `soal_gaya`
--
ALTER TABLE `soal_gaya`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `soal_pola`
--
ALTER TABLE `soal_pola`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `test_gaya`
--
ALTER TABLE `test_gaya`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `test_pola`
--
ALTER TABLE `test_pola`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `hasil_test`
--
ALTER TABLE `hasil_test`
  ADD CONSTRAINT `hasil_test_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hasil_test_ibfk_2` FOREIGN KEY (`test_pola_id`) REFERENCES `test_pola` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `hasil_test_ibfk_3` FOREIGN KEY (`test_gaya_id`) REFERENCES `test_gaya` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `hasil_test_gaya_detail`
--
ALTER TABLE `hasil_test_gaya_detail`
  ADD CONSTRAINT `hasil_test_gaya_detail_ibfk_1` FOREIGN KEY (`hasil_test_id`) REFERENCES `hasil_test` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hasil_test_gaya_detail_ibfk_2` FOREIGN KEY (`soal_id`) REFERENCES `soal_gaya` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hasil_test_gaya_detail_ibfk_3` FOREIGN KEY (`pilihan_id`) REFERENCES `pilihan_gaya` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `hasil_test_pola_detail`
--
ALTER TABLE `hasil_test_pola_detail`
  ADD CONSTRAINT `hasil_test_pola_detail_ibfk_1` FOREIGN KEY (`hasil_test_id`) REFERENCES `hasil_test` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hasil_test_pola_detail_ibfk_2` FOREIGN KEY (`soal_id`) REFERENCES `soal_pola` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hasil_test_pola_detail_ibfk_3` FOREIGN KEY (`pilihan_id`) REFERENCES `pilihan_pola` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `insight`
--
ALTER TABLE `insight`
  ADD CONSTRAINT `insight_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pilihan_gaya`
--
ALTER TABLE `pilihan_gaya`
  ADD CONSTRAINT `pilihan_gaya_ibfk_1` FOREIGN KEY (`soal_id`) REFERENCES `soal_gaya` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pilihan_pola`
--
ALTER TABLE `pilihan_pola`
  ADD CONSTRAINT `pilihan_pola_ibfk_1` FOREIGN KEY (`soal_id`) REFERENCES `soal_pola` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `soal_gaya`
--
ALTER TABLE `soal_gaya`
  ADD CONSTRAINT `soal_gaya_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `test_gaya` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `soal_pola`
--
ALTER TABLE `soal_pola`
  ADD CONSTRAINT `soal_pola_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `test_pola` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
