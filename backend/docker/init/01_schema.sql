-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: capstone-db.cx6iwomi68op.ap-southeast-1.rds.amazonaws.com    Database: capstone-db
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `hasil_test`
--

DROP TABLE IF EXISTS `hasil_test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hasil_test` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `test_pola_id` int DEFAULT NULL,
  `test_gaya_id` int DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `label_pola` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Contoh: Consistent Learner',
  `label_gaya` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Contoh: Visual',
  `persentase_gaya` int DEFAULT NULL COMMENT 'Contoh: 92',
  PRIMARY KEY (`id`),
  KEY `idx_hasil_user` (`user_id`),
  KEY `idx_hasil_test_pola` (`test_pola_id`),
  KEY `idx_hasil_test_gaya` (`test_gaya_id`),
  CONSTRAINT `hasil_test_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `hasil_test_ibfk_2` FOREIGN KEY (`test_pola_id`) REFERENCES `test_pola` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `hasil_test_ibfk_3` FOREIGN KEY (`test_gaya_id`) REFERENCES `test_gaya` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hasil_test_gaya_detail`
--

DROP TABLE IF EXISTS `hasil_test_gaya_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hasil_test_gaya_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hasil_test_id` int NOT NULL,
  `soal_id` int NOT NULL,
  `pilihan_id` int NOT NULL,
  `bobot_visual` int NOT NULL DEFAULT '0',
  `bobot_auditori` int NOT NULL DEFAULT '0',
  `bobot_kinestetik` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `hasil_test_id` (`hasil_test_id`),
  KEY `soal_id` (`soal_id`),
  KEY `pilihan_id` (`pilihan_id`),
  CONSTRAINT `hasil_test_gaya_detail_ibfk_1` FOREIGN KEY (`hasil_test_id`) REFERENCES `hasil_test` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `hasil_test_gaya_detail_ibfk_2` FOREIGN KEY (`soal_id`) REFERENCES `soal_gaya` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `hasil_test_gaya_detail_ibfk_3` FOREIGN KEY (`pilihan_id`) REFERENCES `pilihan_gaya` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=185 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hasil_test_pola_detail`
--

DROP TABLE IF EXISTS `hasil_test_pola_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hasil_test_pola_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hasil_test_id` int NOT NULL,
  `soal_id` int NOT NULL,
  `pilihan_id` int NOT NULL,
  `bobot_consistent` float NOT NULL DEFAULT '0',
  `bobot_fast` float NOT NULL DEFAULT '0',
  `bobot_reflective` float NOT NULL DEFAULT '0',
  `bobot_balanced` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `hasil_test_id` (`hasil_test_id`),
  KEY `soal_id` (`soal_id`),
  KEY `pilihan_id` (`pilihan_id`),
  CONSTRAINT `hasil_test_pola_detail_ibfk_1` FOREIGN KEY (`hasil_test_id`) REFERENCES `hasil_test` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `hasil_test_pola_detail_ibfk_2` FOREIGN KEY (`soal_id`) REFERENCES `soal_pola` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `hasil_test_pola_detail_ibfk_3` FOREIGN KEY (`pilihan_id`) REFERENCES `pilihan_pola` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=290 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `insight`
--

DROP TABLE IF EXISTS `insight`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insight` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `insight` text COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `insight_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `motd`
--

DROP TABLE IF EXISTS `motd`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `motd` (
  `motd_id` int NOT NULL AUTO_INCREMENT,
  `message` text COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`motd_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pilihan_gaya`
--

DROP TABLE IF EXISTS `pilihan_gaya`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pilihan_gaya` (
  `id` int NOT NULL AUTO_INCREMENT,
  `soal_id` int NOT NULL,
  `option_text` text COLLATE utf8mb4_general_ci NOT NULL,
  `bobot_visual` int NOT NULL DEFAULT '0',
  `bobot_auditori` int NOT NULL DEFAULT '0',
  `bobot_kinestetik` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_pilihan_gaya_soal` (`soal_id`),
  CONSTRAINT `pilihan_gaya_ibfk_1` FOREIGN KEY (`soal_id`) REFERENCES `soal_gaya` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pilihan_pola`
--

DROP TABLE IF EXISTS `pilihan_pola`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pilihan_pola` (
  `id` int NOT NULL AUTO_INCREMENT,
  `soal_id` int NOT NULL,
  `option_text` text COLLATE utf8mb4_general_ci NOT NULL,
  `bobot_consistent` float NOT NULL DEFAULT '0',
  `bobot_fast` float NOT NULL DEFAULT '0',
  `bobot_reflective` float NOT NULL DEFAULT '0',
  `bobot_balanced` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_pilihan_pola_soal` (`soal_id`),
  CONSTRAINT `pilihan_pola_ibfk_1` FOREIGN KEY (`soal_id`) REFERENCES `soal_pola` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `soal_gaya`
--

DROP TABLE IF EXISTS `soal_gaya`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `soal_gaya` (
  `id` int NOT NULL AUTO_INCREMENT,
  `test_id` int NOT NULL,
  `question` text COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_soal_gaya_test` (`test_id`),
  CONSTRAINT `soal_gaya_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `test_gaya` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `soal_pola`
--

DROP TABLE IF EXISTS `soal_pola`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `soal_pola` (
  `id` int NOT NULL AUTO_INCREMENT,
  `test_id` int NOT NULL,
  `question` text COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_soal_pola_test` (`test_id`),
  CONSTRAINT `soal_pola_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `test_pola` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `test_gaya`
--

DROP TABLE IF EXISTS `test_gaya`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_gaya` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `test_pola`
--

DROP TABLE IF EXISTS `test_pola`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_pola` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` enum('admin','user') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'user',
  `learning_style` enum('visual','auditori','kinestetik') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `learning_pattern` enum('consistent','fast','reflective','balanced') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-14 11:00:47
