-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 22, 2025 at 05:07 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `capstone_asah`
--

-- --------------------------------------------------------

--
-- Table structure for table `hasil_test`
--

CREATE TABLE `hasil_test` (
  `id` int(11) NOT NULL,
  `test_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_bobot_consistent_learner` int(11) NOT NULL,
  `total_bobot_fast_learner` int(11) NOT NULL,
  `total_bobot_reflective_learner` int(11) NOT NULL,
  `total_bobot_balanced_learner` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pilihan`
--

CREATE TABLE `pilihan` (
  `id` int(11) NOT NULL,
  `soal_id` int(11) NOT NULL,
  `isi` text NOT NULL,
  `bobot_consistent_learner` int(11) NOT NULL,
  `bobot_fast_learner` int(11) NOT NULL,
  `bobot_reflective_learner` int(11) NOT NULL,
  `bobot_balanced_learner` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `soal`
--

CREATE TABLE `soal` (
  `id` int(11) NOT NULL,
  `pertanyaan` text NOT NULL,
  `test_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `test`
--

CREATE TABLE `test` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL,
  `gaya_belajar` enum('consistent','fast','reflective','balanced') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `hasil_test`
--
ALTER TABLE `hasil_test`
  ADD PRIMARY KEY (`id`),
  ADD KEY `test_id` (`test_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `pilihan`
--
ALTER TABLE `pilihan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `soal_id` (`soal_id`);

--
-- Indexes for table `soal`
--
ALTER TABLE `soal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `test_id` (`test_id`);

--
-- Indexes for table `test`
--
ALTER TABLE `test`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `hasil_test`
--
ALTER TABLE `hasil_test`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pilihan`
--
ALTER TABLE `pilihan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `soal`
--
ALTER TABLE `soal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `test`
--
ALTER TABLE `test`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `hasil_test`
--
ALTER TABLE `hasil_test`
  ADD CONSTRAINT `hasil_test_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `test` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hasil_test_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pilihan`
--
ALTER TABLE `pilihan`
  ADD CONSTRAINT `pilihan_ibfk_1` FOREIGN KEY (`soal_id`) REFERENCES `soal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `soal`
--
ALTER TABLE `soal`
  ADD CONSTRAINT `soal_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `test` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
