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

--
-- Current Database: `capstone-db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `capstone-db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `capstone-db`;

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
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hasil_test`
--

LOCK TABLES `hasil_test` WRITE;
/*!40000 ALTER TABLE `hasil_test` DISABLE KEYS */;
INSERT INTO `hasil_test` VALUES (1,1,1,1,'2025-12-14 01:17:41',NULL,NULL,NULL),(2,2,1,1,'2025-12-14 01:17:41',NULL,NULL,NULL),(3,6,1,1,'2025-12-14 01:18:50','Fast Learner','Auditori',62),(4,6,1,1,'2025-12-14 04:30:04','Balanced Learner','Kinestetik',71),(5,7,1,1,'2025-12-14 04:32:43','Consistent Learner','Visual',67),(6,8,1,1,'2025-12-14 04:37:29','Reflective Learner','Kinestetik',71),(7,7,1,1,'2025-12-14 04:50:40','Fast Learner','Visual',50),(8,6,1,1,'2025-12-14 05:07:39','Fast Learner','Auditori',71),(9,10,1,1,'2025-12-14 05:15:54','Balanced Learner','Kinestetik',62),(10,13,1,1,'2025-12-14 05:37:34','Fast Learner','Kinestetik',62),(11,13,1,1,'2025-12-14 05:42:34','Balanced Learner','Kinestetik',71),(12,11,1,NULL,'2025-12-14 06:07:33','Fast Learner',NULL,NULL),(13,11,1,NULL,'2025-12-14 06:07:35','Fast Learner',NULL,NULL),(14,10,1,1,'2025-12-14 06:09:48','Balanced Learner','Kinestetik',71),(15,10,1,1,'2025-12-14 06:12:04','Balanced Learner','Kinestetik',71),(16,10,1,1,'2025-12-14 06:14:49','Balanced Learner','Kinestetik',71),(17,10,1,1,'2025-12-14 06:16:10','Balanced Learner','Kinestetik',71),(18,10,1,1,'2025-12-14 06:17:08','Balanced Learner','Visual',42),(19,10,1,NULL,'2025-12-14 06:18:48','Fast Learner',NULL,NULL),(20,10,1,1,'2025-12-14 06:36:57','Balanced Learner','Kinestetik',62),(21,10,1,1,'2025-12-14 07:59:22','Fast Learner','Auditori',51),(22,14,1,NULL,'2025-12-14 09:20:10','Fast Learner',NULL,NULL),(23,14,1,1,'2025-12-14 09:24:31','Balanced Learner','Auditori',52),(24,14,1,1,'2025-12-14 09:25:22','Fast Learner','Auditori',71),(25,14,1,1,'2025-12-14 09:26:21','Consistent Learner','Kinestetik',53),(26,14,1,1,'2025-12-14 09:40:41','Fast Learner','Visual',67),(27,14,1,1,'2025-12-14 09:41:22','Reflective Learner','Kinestetik',71),(28,14,1,NULL,'2025-12-14 09:45:39','Unknown',NULL,NULL),(29,14,1,1,'2025-12-14 09:45:47','Balanced Learner','Kinestetik',62),(30,16,1,1,'2025-12-14 10:01:29','Balanced Learner','Kinestetik',71),(31,16,1,1,'2025-12-14 10:02:09','Balanced Learner','Kinestetik',71),(32,16,1,1,'2025-12-14 10:03:14','Balanced Learner','Kinestetik',71),(33,17,1,1,'2025-12-14 10:44:07','Balanced Learner','Visual',58),(34,18,1,1,'2025-12-14 11:18:25','Fast Learner','Auditori',71),(35,19,1,1,'2025-12-14 11:32:43','Fast Learner','Visual',50),(36,6,1,1,'2025-12-14 11:45:51','Balanced Learner','Kinestetik',71),(37,8,1,1,'2025-12-14 12:14:30','Reflective Learner','Kinestetik',71),(38,18,1,1,'2025-12-14 15:58:47','Balanced Learner','Kinestetik',71),(39,20,1,1,'2025-12-14 16:01:04','Consistent Learner','Visual',67),(40,21,1,1,'2025-12-14 16:05:10','Balanced Learner','Kinestetik',63),(41,22,1,1,'2025-12-14 16:56:16','Consistent Learner','Visual',67),(42,11,1,1,'2025-12-15 03:40:35','Reflective Learner','Kinestetik',71),(43,23,1,1,'2025-12-15 04:05:06','Balanced Learner','Visual',67),(44,23,1,1,'2025-12-15 06:55:01','Reflective Learner','Auditori',62),(45,24,1,1,'2025-12-15 12:18:19','Balanced Learner','Visual',51),(46,6,1,1,'2025-12-15 17:35:55','Balanced Learner','Kinestetik',71),(47,26,1,1,'2025-12-15 20:22:24','Reflective Learner','Kinestetik',71),(48,26,1,1,'2025-12-15 21:33:33','Fast Learner','Auditori',60),(49,27,1,1,'2025-12-15 22:08:31','Reflective Learner','Kinestetik',43),(50,6,1,1,'2025-12-17 08:37:29','Fast Learner','Visual',67),(51,31,1,1,'2025-12-17 18:19:31','Balanced Learner','Auditori',71),(52,32,1,1,'2025-12-17 21:51:57','Balanced Learner','Visual',67),(53,33,1,1,'2025-12-17 22:11:35','Balanced Learner','Visual',58),(54,34,1,1,'2025-12-17 22:15:02','Balanced Learner','Kinestetik',71),(55,36,1,1,'2025-12-19 09:24:51','Balanced Learner','Kinestetik',52),(56,6,1,1,'2025-12-20 15:09:34','Fast Learner','Kinestetik',62),(57,6,1,1,'2025-12-22 08:45:20','Reflective Learner','Kinestetik',71),(58,6,1,1,'2025-12-24 16:53:26','Fast Learner','Visual',67),(59,6,1,1,'2025-12-26 18:01:46','Fast Learner','Visual',67),(60,6,1,1,'2025-12-26 22:19:45','Balanced Learner','Kinestetik',71),(61,6,1,1,'2025-12-26 22:20:15','Fast Learner','Auditori',71),(62,40,1,1,'2025-12-27 08:24:58','Reflective Learner','Auditori',52),(63,6,1,1,'2026-01-04 13:45:28','Balanced Learner','Auditori',43);
/*!40000 ALTER TABLE `hasil_test` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=365 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hasil_test_gaya_detail`
--

LOCK TABLES `hasil_test_gaya_detail` WRITE;
/*!40000 ALTER TABLE `hasil_test_gaya_detail` DISABLE KEYS */;
INSERT INTO `hasil_test_gaya_detail` VALUES (11,3,1,2,1,5,1),(12,3,2,5,1,5,1),(13,3,3,8,1,5,1),(14,3,4,11,1,5,1),(15,3,5,14,1,5,1),(16,3,6,18,1,1,5),(17,4,1,3,1,1,5),(18,4,2,6,1,1,5),(19,4,3,9,1,1,5),(20,4,4,12,1,1,5),(21,4,5,15,1,1,5),(22,4,6,18,1,1,5),(23,5,1,1,5,1,1),(24,5,2,4,5,1,2),(25,5,3,7,5,1,1),(26,5,4,10,5,1,1),(27,5,5,13,5,1,2),(28,5,6,16,5,1,2),(29,6,1,3,1,1,5),(30,6,2,6,1,1,5),(31,6,3,9,1,1,5),(32,6,4,12,1,1,5),(33,6,5,15,1,1,5),(34,6,6,18,1,1,5),(35,7,1,1,5,1,1),(36,7,2,4,5,1,2),(37,7,3,8,1,5,1),(38,7,4,10,5,1,1),(39,7,5,15,1,1,5),(40,7,6,16,5,1,2),(41,8,1,2,1,5,1),(42,8,2,5,1,5,1),(43,8,3,8,1,5,1),(44,8,4,11,1,5,1),(45,8,5,14,1,5,1),(46,8,6,17,1,5,1),(47,9,1,3,1,1,5),(48,9,2,6,1,1,5),(49,9,3,8,1,5,1),(50,9,4,12,1,1,5),(51,9,5,15,1,1,5),(52,9,6,18,1,1,5),(53,10,1,3,1,1,5),(54,10,2,5,1,5,1),(55,10,3,9,1,1,5),(56,10,4,12,1,1,5),(57,10,5,15,1,1,5),(58,10,6,18,1,1,5),(59,11,1,3,1,1,5),(60,11,2,6,1,1,5),(61,11,3,9,1,1,5),(62,11,4,12,1,1,5),(63,11,5,15,1,1,5),(64,11,6,18,1,1,5),(65,14,1,3,1,1,5),(66,14,2,6,1,1,5),(67,14,3,9,1,1,5),(68,14,4,12,1,1,5),(69,14,5,15,1,1,5),(70,14,6,18,1,1,5),(71,15,1,3,1,1,5),(72,15,2,6,1,1,5),(73,15,3,9,1,1,5),(74,15,4,12,1,1,5),(75,15,5,15,1,1,5),(76,15,6,18,1,1,5),(77,16,1,3,1,1,5),(78,16,2,6,1,1,5),(79,16,3,9,1,1,5),(80,16,4,12,1,1,5),(81,16,5,15,1,1,5),(82,16,6,18,1,1,5),(83,17,1,3,1,1,5),(84,17,2,6,1,1,5),(85,17,3,9,1,1,5),(86,17,4,12,1,1,5),(87,17,5,15,1,1,5),(88,17,6,18,1,1,5),(89,18,1,2,1,5,1),(90,18,2,5,1,5,1),(91,18,3,8,1,5,1),(92,18,4,11,1,5,1),(93,18,5,15,1,1,5),(94,18,6,18,1,1,5),(95,18,1,1,5,1,1),(96,18,2,4,5,1,2),(97,18,3,7,5,1,1),(98,18,4,11,1,5,1),(99,18,5,14,1,5,1),(100,18,6,17,1,5,1),(101,18,1,1,5,1,1),(102,18,2,4,5,1,2),(103,18,3,7,5,1,1),(104,18,4,11,1,5,1),(105,18,5,14,1,5,1),(106,18,6,17,1,5,1),(107,18,1,1,5,1,1),(108,18,2,4,5,1,2),(109,18,3,7,5,1,1),(110,18,4,11,1,5,1),(111,18,5,14,1,5,1),(112,18,6,17,1,5,1),(113,20,1,2,1,5,1),(114,20,2,6,1,1,5),(115,20,3,9,1,1,5),(116,20,4,12,1,1,5),(117,20,5,15,1,1,5),(118,20,6,18,1,1,5),(119,21,1,2,1,5,1),(120,21,2,5,1,5,1),(121,21,3,8,1,5,1),(122,21,4,11,1,5,1),(123,21,5,15,1,1,5),(124,21,6,16,5,1,2),(125,23,1,2,1,5,1),(126,23,2,5,1,5,1),(127,23,3,7,5,1,1),(128,23,4,11,1,5,1),(129,23,5,14,1,5,1),(130,23,6,18,1,1,5),(131,24,1,2,1,5,1),(132,24,2,5,1,5,1),(133,24,3,8,1,5,1),(134,24,4,11,1,5,1),(135,24,5,14,1,5,1),(136,24,6,17,1,5,1),(137,25,1,3,1,1,5),(138,25,2,6,1,1,5),(139,25,3,9,1,1,5),(140,25,4,11,1,5,1),(141,25,5,15,1,1,5),(142,25,6,16,5,1,2),(143,26,1,1,5,1,1),(144,26,2,4,5,1,2),(145,26,3,7,5,1,1),(146,26,4,10,5,1,1),(147,26,5,13,5,1,2),(148,26,6,16,5,1,2),(149,27,1,3,1,1,5),(150,27,2,6,1,1,5),(151,27,3,9,1,1,5),(152,27,4,12,1,1,5),(153,27,5,15,1,1,5),(154,27,6,18,1,1,5),(155,29,1,2,1,5,1),(156,29,2,6,1,1,5),(157,29,3,9,1,1,5),(158,29,4,12,1,1,5),(159,29,5,15,1,1,5),(160,29,6,18,1,1,5),(161,30,1,3,1,1,5),(162,30,2,6,1,1,5),(163,30,3,9,1,1,5),(164,30,4,12,1,1,5),(165,30,5,15,1,1,5),(166,30,6,18,1,1,5),(167,31,1,3,1,1,5),(168,31,2,6,1,1,5),(169,31,3,9,1,1,5),(170,31,4,12,1,1,5),(171,31,5,15,1,1,5),(172,31,6,18,1,1,5),(173,32,1,3,1,1,5),(174,32,2,6,1,1,5),(175,32,3,9,1,1,5),(176,32,4,12,1,1,5),(177,32,5,15,1,1,5),(178,32,6,18,1,1,5),(179,33,1,3,1,1,5),(180,33,2,4,5,1,2),(181,33,3,7,5,1,1),(182,33,4,10,5,1,1),(183,33,5,13,5,1,2),(184,33,6,16,5,1,2),(185,34,1,2,1,5,1),(186,34,2,5,1,5,1),(187,34,3,8,1,5,1),(188,34,4,11,1,5,1),(189,34,5,14,1,5,1),(190,34,6,17,1,5,1),(191,35,1,1,5,1,1),(192,35,2,4,5,1,2),(193,35,3,8,1,5,1),(194,35,4,10,5,1,1),(195,35,5,15,1,1,5),(196,35,6,16,5,1,2),(197,36,1,3,1,1,5),(198,36,2,6,1,1,5),(199,36,3,9,1,1,5),(200,36,4,12,1,1,5),(201,36,5,15,1,1,5),(202,36,6,18,1,1,5),(203,37,1,3,1,1,5),(204,37,2,6,1,1,5),(205,37,3,9,1,1,5),(206,37,4,12,1,1,5),(207,37,5,15,1,1,5),(208,37,6,18,1,1,5),(209,38,1,3,1,1,5),(210,38,2,6,1,1,5),(211,38,3,9,1,1,5),(212,38,4,12,1,1,5),(213,38,5,15,1,1,5),(214,38,6,18,1,1,5),(215,39,1,1,5,1,1),(216,39,2,4,5,1,2),(217,39,3,7,5,1,1),(218,39,4,10,5,1,1),(219,39,5,13,5,1,2),(220,39,6,16,5,1,2),(221,40,1,3,1,1,5),(222,40,2,6,1,1,5),(223,40,3,9,1,1,5),(224,40,4,12,1,1,5),(225,40,5,13,5,1,2),(226,40,6,18,1,1,5),(227,41,1,1,5,1,1),(228,41,2,4,5,1,2),(229,41,3,7,5,1,1),(230,41,4,10,5,1,1),(231,41,5,13,5,1,2),(232,41,6,16,5,1,2),(233,42,1,3,1,1,5),(234,42,2,6,1,1,5),(235,42,3,9,1,1,5),(236,42,4,12,1,1,5),(237,42,5,15,1,1,5),(238,42,6,18,1,1,5),(239,43,1,1,5,1,1),(240,43,2,4,5,1,2),(241,43,3,7,5,1,1),(242,43,4,10,5,1,1),(243,43,5,13,5,1,2),(244,43,6,16,5,1,2),(245,44,1,3,1,1,5),(246,44,2,5,1,5,1),(247,44,3,8,1,5,1),(248,44,4,11,1,5,1),(249,44,5,14,1,5,1),(250,44,6,17,1,5,1),(251,45,1,1,5,1,1),(252,45,2,5,1,5,1),(253,45,3,7,5,1,1),(254,45,4,10,5,1,1),(255,45,5,14,1,5,1),(256,45,6,16,5,1,2),(257,46,1,3,1,1,5),(258,46,2,6,1,1,5),(259,46,3,9,1,1,5),(260,46,4,12,1,1,5),(261,46,5,15,1,1,5),(262,46,6,18,1,1,5),(263,47,1,3,1,1,5),(264,47,2,6,1,1,5),(265,47,3,9,1,1,5),(266,47,4,12,1,1,5),(267,47,5,15,1,1,5),(268,47,6,18,1,1,5),(269,48,1,2,1,5,1),(270,48,2,4,5,1,2),(271,48,3,8,1,5,1),(272,48,4,11,1,5,1),(273,48,5,14,1,5,1),(274,48,6,17,1,5,1),(275,49,1,1,5,1,1),(276,49,2,5,1,5,1),(277,49,3,8,1,5,1),(278,49,4,12,1,1,5),(279,49,5,15,1,1,5),(280,49,6,18,1,1,5),(281,50,1,1,5,1,1),(282,50,2,4,5,1,2),(283,50,3,7,5,1,1),(284,50,4,10,5,1,1),(285,50,5,13,5,1,2),(286,50,6,16,5,1,2),(287,51,1,2,1,5,1),(288,51,2,5,1,5,1),(289,51,3,8,1,5,1),(290,51,4,11,1,5,1),(291,51,5,14,1,5,1),(292,51,6,17,1,5,1),(293,52,1,1,5,1,1),(294,52,2,4,5,1,2),(295,52,3,7,5,1,1),(296,52,4,10,5,1,1),(297,52,5,13,5,1,2),(298,52,6,16,5,1,2),(299,53,1,3,1,1,5),(300,53,2,4,5,1,2),(301,53,3,7,5,1,1),(302,53,4,10,5,1,1),(303,53,5,13,5,1,2),(304,53,6,16,5,1,2),(305,54,1,3,1,1,5),(306,54,2,6,1,1,5),(307,54,3,9,1,1,5),(308,54,4,12,1,1,5),(309,54,5,15,1,1,5),(310,54,6,18,1,1,5),(311,55,1,2,1,5,1),(312,55,2,6,1,1,5),(313,55,3,9,1,1,5),(314,55,4,12,1,1,5),(315,55,5,15,1,1,5),(316,55,6,17,1,5,1),(317,56,1,2,1,5,1),(318,56,2,6,1,1,5),(319,56,3,9,1,1,5),(320,56,4,12,1,1,5),(321,56,5,15,1,1,5),(322,56,6,18,1,1,5),(323,57,1,3,1,1,5),(324,57,2,6,1,1,5),(325,57,3,9,1,1,5),(326,57,4,12,1,1,5),(327,57,5,15,1,1,5),(328,57,6,18,1,1,5),(329,58,1,1,5,1,1),(330,58,2,4,5,1,2),(331,58,3,7,5,1,1),(332,58,4,10,5,1,1),(333,58,5,13,5,1,2),(334,58,6,16,5,1,2),(335,59,1,1,5,1,1),(336,59,2,4,5,1,2),(337,59,3,7,5,1,1),(338,59,4,10,5,1,1),(339,59,5,13,5,1,2),(340,59,6,16,5,1,2),(341,60,1,3,1,1,5),(342,60,2,6,1,1,5),(343,60,3,9,1,1,5),(344,60,4,12,1,1,5),(345,60,5,15,1,1,5),(346,60,6,18,1,1,5),(347,61,1,2,1,5,1),(348,61,2,5,1,5,1),(349,61,3,8,1,5,1),(350,61,4,11,1,5,1),(351,61,5,14,1,5,1),(352,61,6,17,1,5,1),(353,62,1,3,1,1,5),(354,62,2,5,1,5,1),(355,62,3,8,1,5,1),(356,62,4,11,1,5,1),(357,62,5,14,1,5,1),(358,62,6,18,1,1,5),(359,63,1,2,1,5,1),(360,63,2,5,1,5,1),(361,63,3,8,1,5,1),(362,63,4,10,5,1,1),(363,63,5,15,1,1,5),(364,63,6,18,1,1,5);
/*!40000 ALTER TABLE `hasil_test_gaya_detail` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=560 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hasil_test_pola_detail`
--

LOCK TABLES `hasil_test_pola_detail` WRITE;
/*!40000 ALTER TABLE `hasil_test_pola_detail` DISABLE KEYS */;
INSERT INTO `hasil_test_pola_detail` VALUES (11,3,1,2,0,7,0,0),(12,3,2,6,0,2,0,0),(13,3,3,10,0,4,0,0),(14,3,4,14,0,0.08,0,0),(15,3,5,18,0,1,0,0),(16,3,6,22,0,0.12,0,0),(17,3,7,26,0,3,0,0),(18,3,8,30,0,95,0,0),(19,3,9,34,0,0.12,0,0),(20,4,1,4,0,0,0,5),(21,4,2,8,0,0,0,1.5),(22,4,3,12,0,0,0,5),(23,4,4,16,0,0,0,0.5),(24,4,5,20,0,0,0,3),(25,4,6,24,0,0,0,0.35),(26,4,7,28,0,0,0,2),(27,4,8,31,0,0,89,0),(28,4,9,35,0,0,0.87,0),(29,5,1,1,4,0,0,0),(30,5,2,5,1,0,0,0),(31,5,3,9,6,0,0,0),(32,5,4,13,0.16,0,0,0),(33,5,5,17,2,0,0,0),(34,5,6,21,0.37,0,0,0),(35,5,7,25,1,0,0,0),(36,5,8,29,83,0,0,0),(37,5,9,33,0.62,0,0,0),(38,6,1,1,4,0,0,0),(39,6,2,6,0,2,0,0),(40,6,3,11,0,0,3,0),(41,6,4,15,0,0,0.83,0),(42,6,5,19,0,0,5,0),(43,6,6,22,0,0.12,0,0),(44,6,7,27,0,0,4,0),(45,6,8,31,0,0,89,0),(46,6,9,35,0,0,0.87,0),(47,7,1,3,0,0,3,0),(48,7,2,8,0,0,0,1.5),(49,7,3,12,0,0,0,5),(50,7,4,16,0,0,0,0.5),(51,7,5,18,0,1,0,0),(52,7,6,22,0,0.12,0,0),(53,7,7,27,0,0,4,0),(54,7,8,30,0,95,0,0),(55,7,9,36,0,0,0,0.37),(56,8,1,2,0,7,0,0),(57,8,2,6,0,2,0,0),(58,8,3,10,0,4,0,0),(59,8,4,14,0,0.08,0,0),(60,8,5,18,0,1,0,0),(61,8,6,22,0,0.12,0,0),(62,8,7,26,0,3,0,0),(63,8,8,30,0,95,0,0),(64,8,9,34,0,0.12,0,0),(65,9,1,2,0,7,0,0),(66,9,2,8,0,0,0,1.5),(67,9,3,12,0,0,0,5),(68,9,4,16,0,0,0,0.5),(69,9,5,18,0,1,0,0),(70,9,6,24,0,0,0,0.35),(71,9,7,28,0,0,0,2),(72,9,8,32,0,0,0,85),(73,9,9,36,0,0,0,0.37),(74,10,1,2,0,7,0,0),(75,10,2,6,0,2,0,0),(76,10,3,10,0,4,0,0),(77,10,4,14,0,0.08,0,0),(78,10,5,18,0,1,0,0),(79,10,6,22,0,0.12,0,0),(80,10,7,26,0,3,0,0),(81,10,8,30,0,95,0,0),(82,10,9,34,0,0.12,0,0),(83,11,1,1,4,0,0,0),(84,11,2,7,0,0,0.5,0),(85,11,3,11,0,0,3,0),(86,11,4,16,0,0,0,0.5),(87,11,5,20,0,0,0,3),(88,11,6,24,0,0,0,0.35),(89,11,7,28,0,0,0,2),(90,11,8,32,0,0,0,85),(91,11,9,36,0,0,0,0.37),(92,12,1,2,0,7,0,0),(93,12,2,6,0,2,0,0),(94,12,3,10,0,4,0,0),(95,12,4,14,0,0.08,0,0),(96,12,5,18,0,1,0,0),(97,12,6,22,0,0.12,0,0),(98,12,7,26,0,3,0,0),(99,12,8,29,83,0,0,0),(100,12,9,34,0,0.12,0,0),(101,13,1,2,0,7,0,0),(102,13,2,6,0,2,0,0),(103,13,3,10,0,4,0,0),(104,13,4,14,0,0.08,0,0),(105,13,5,18,0,1,0,0),(106,13,6,22,0,0.12,0,0),(107,13,7,26,0,3,0,0),(108,13,8,29,83,0,0,0),(109,13,9,34,0,0.12,0,0),(110,14,1,4,0,0,0,5),(111,14,2,8,0,0,0,1.5),(112,14,3,12,0,0,0,5),(113,14,4,16,0,0,0,0.5),(114,14,5,20,0,0,0,3),(115,14,6,24,0,0,0,0.35),(116,14,7,28,0,0,0,2),(117,14,8,32,0,0,0,85),(118,14,9,36,0,0,0,0.37),(119,15,1,4,0,0,0,5),(120,15,2,8,0,0,0,1.5),(121,15,3,12,0,0,0,5),(122,15,4,16,0,0,0,0.5),(123,15,5,20,0,0,0,3),(124,15,6,24,0,0,0,0.35),(125,15,7,28,0,0,0,2),(126,15,8,32,0,0,0,85),(127,15,9,36,0,0,0,0.37),(128,16,1,4,0,0,0,5),(129,16,2,8,0,0,0,1.5),(130,16,3,12,0,0,0,5),(131,16,4,16,0,0,0,0.5),(132,16,5,20,0,0,0,3),(133,16,6,24,0,0,0,0.35),(134,16,7,28,0,0,0,2),(135,16,8,32,0,0,0,85),(136,16,9,36,0,0,0,0.37),(137,17,1,4,0,0,0,5),(138,17,2,8,0,0,0,1.5),(139,17,3,12,0,0,0,5),(140,17,4,16,0,0,0,0.5),(141,17,5,20,0,0,0,3),(142,17,6,24,0,0,0,0.35),(143,17,7,28,0,0,0,2),(144,17,8,32,0,0,0,85),(145,17,9,36,0,0,0,0.37),(146,18,1,4,0,0,0,5),(147,18,2,8,0,0,0,1.5),(148,18,3,12,0,0,0,5),(149,18,4,16,0,0,0,0.5),(150,18,5,20,0,0,0,3),(151,18,6,24,0,0,0,0.35),(152,18,7,28,0,0,0,2),(153,18,8,32,0,0,0,85),(154,18,9,36,0,0,0,0.37),(155,19,1,2,0,7,0,0),(156,19,2,6,0,2,0,0),(157,19,3,10,0,4,0,0),(158,19,4,14,0,0.08,0,0),(159,19,5,18,0,1,0,0),(160,19,6,22,0,0.12,0,0),(161,19,7,26,0,3,0,0),(162,19,8,29,83,0,0,0),(163,19,9,34,0,0.12,0,0),(164,20,1,1,4,0,0,0),(165,20,2,8,0,0,0,1.5),(166,20,3,12,0,0,0,5),(167,20,4,16,0,0,0,0.5),(168,20,5,20,0,0,0,3),(169,20,6,24,0,0,0,0.35),(170,20,7,28,0,0,0,2),(171,20,8,32,0,0,0,85),(172,20,9,36,0,0,0,0.37),(173,21,1,2,0,7,0,0),(174,21,2,6,0,2,0,0),(175,21,3,10,0,4,0,0),(176,21,4,14,0,0.08,0,0),(177,21,5,18,0,1,0,0),(178,21,6,22,0,0.12,0,0),(179,21,7,26,0,3,0,0),(180,21,8,30,0,95,0,0),(181,21,9,34,0,0.12,0,0),(182,22,1,2,0,7,0,0),(183,22,2,6,0,2,0,0),(184,22,3,10,0,4,0,0),(185,22,4,14,0,0.08,0,0),(186,22,5,18,0,1,0,0),(187,22,6,22,0,0.12,0,0),(188,22,7,27,0,0,4,0),(189,22,8,30,0,95,0,0),(190,22,9,34,0,0.12,0,0),(191,23,1,2,0,7,0,0),(192,23,2,8,0,0,0,1.5),(193,23,3,12,0,0,0,5),(194,23,4,16,0,0,0,0.5),(195,23,5,19,0,0,5,0),(196,23,6,24,0,0,0,0.35),(197,23,7,28,0,0,0,2),(198,23,8,32,0,0,0,85),(199,23,9,36,0,0,0,0.37),(200,24,1,2,0,7,0,0),(201,24,2,6,0,2,0,0),(202,24,3,10,0,4,0,0),(203,24,4,14,0,0.08,0,0),(204,24,5,18,0,1,0,0),(205,24,6,22,0,0.12,0,0),(206,24,7,26,0,3,0,0),(207,24,8,30,0,95,0,0),(208,24,9,34,0,0.12,0,0),(209,25,1,1,4,0,0,0),(210,25,2,8,0,0,0,1.5),(211,25,3,9,6,0,0,0),(212,25,4,13,0.16,0,0,0),(213,25,5,17,2,0,0,0),(214,25,6,21,0.37,0,0,0),(215,25,7,25,1,0,0,0),(216,25,8,29,83,0,0,0),(217,25,9,33,0.62,0,0,0),(218,26,1,4,0,0,0,5),(219,26,2,8,0,0,0,1.5),(220,26,3,10,0,4,0,0),(221,26,4,14,0,0.08,0,0),(222,26,5,20,0,0,0,3),(223,26,6,22,0,0.12,0,0),(224,26,7,26,0,3,0,0),(225,26,8,30,0,95,0,0),(226,26,9,34,0,0.12,0,0),(227,27,1,3,0,0,3,0),(228,27,2,7,0,0,0.5,0),(229,27,3,11,0,0,3,0),(230,27,4,15,0,0,0.83,0),(231,27,5,19,0,0,5,0),(232,27,6,23,0,0,0.75,0),(233,27,7,27,0,0,4,0),(234,27,8,31,0,0,89,0),(235,27,9,35,0,0,0.87,0),(236,28,1,4,0,0,0,5),(237,28,2,5,1,0,0,0),(238,28,3,12,0,0,0,5),(239,28,4,16,0,0,0,0.5),(240,28,5,20,0,0,0,3),(241,28,6,24,0,0,0,0.35),(242,28,7,28,0,0,0,2),(243,28,8,32,0,0,0,85),(244,28,9,36,0,0,0,0.37),(245,29,1,4,0,0,0,5),(246,29,2,5,1,0,0,0),(247,29,3,12,0,0,0,5),(248,29,4,16,0,0,0,0.5),(249,29,5,20,0,0,0,3),(250,29,6,24,0,0,0,0.35),(251,29,7,28,0,0,0,2),(252,29,8,32,0,0,0,85),(253,29,9,36,0,0,0,0.37),(254,30,1,4,0,0,0,5),(255,30,2,8,0,0,0,1.5),(256,30,3,12,0,0,0,5),(257,30,4,16,0,0,0,0.5),(258,30,5,19,0,0,5,0),(259,30,6,24,0,0,0,0.35),(260,30,7,28,0,0,0,2),(261,30,8,32,0,0,0,85),(262,30,9,36,0,0,0,0.37),(263,31,1,4,0,0,0,5),(264,31,2,8,0,0,0,1.5),(265,31,3,12,0,0,0,5),(266,31,4,16,0,0,0,0.5),(267,31,5,19,0,0,5,0),(268,31,6,24,0,0,0,0.35),(269,31,7,28,0,0,0,2),(270,31,8,32,0,0,0,85),(271,31,9,36,0,0,0,0.37),(272,32,1,4,0,0,0,5),(273,32,2,8,0,0,0,1.5),(274,32,3,12,0,0,0,5),(275,32,4,16,0,0,0,0.5),(276,32,5,19,0,0,5,0),(277,32,6,24,0,0,0,0.35),(278,32,7,28,0,0,0,2),(279,32,8,32,0,0,0,85),(280,32,9,36,0,0,0,0.37),(281,33,1,2,0,7,0,0),(282,33,2,8,0,0,0,1.5),(283,33,3,12,0,0,0,5),(284,33,4,16,0,0,0,0.5),(285,33,5,20,0,0,0,3),(286,33,6,24,0,0,0,0.35),(287,33,7,28,0,0,0,2),(288,33,8,32,0,0,0,85),(289,33,9,36,0,0,0,0.37),(290,34,1,1,4,0,0,0),(291,34,2,5,1,0,0,0),(292,34,3,9,6,0,0,0),(293,34,4,13,0.16,0,0,0),(294,34,5,18,0,1,0,0),(295,34,6,22,0,0.12,0,0),(296,34,7,26,0,3,0,0),(297,34,8,30,0,95,0,0),(298,34,9,34,0,0.12,0,0),(299,35,1,4,0,0,0,5),(300,35,2,8,0,0,0,1.5),(301,35,3,10,0,4,0,0),(302,35,4,14,0,0.08,0,0),(303,35,5,18,0,1,0,0),(304,35,6,22,0,0.12,0,0),(305,35,7,26,0,3,0,0),(306,35,8,31,0,0,89,0),(307,35,9,34,0,0.12,0,0),(308,36,1,2,0,7,0,0),(309,36,2,8,0,0,0,1.5),(310,36,3,12,0,0,0,5),(311,36,4,16,0,0,0,0.5),(312,36,5,19,0,0,5,0),(313,36,6,23,0,0,0.75,0),(314,36,7,28,0,0,0,2),(315,36,8,32,0,0,0,85),(316,36,9,36,0,0,0,0.37),(317,37,1,1,4,0,0,0),(318,37,2,6,0,2,0,0),(319,37,3,10,0,4,0,0),(320,37,4,14,0,0.08,0,0),(321,37,5,19,0,0,5,0),(322,37,6,23,0,0,0.75,0),(323,37,7,27,0,0,4,0),(324,37,8,31,0,0,89,0),(325,37,9,35,0,0,0.87,0),(326,38,1,4,0,0,0,5),(327,38,2,8,0,0,0,1.5),(328,38,3,12,0,0,0,5),(329,38,4,16,0,0,0,0.5),(330,38,5,20,0,0,0,3),(331,38,6,23,0,0,0.75,0),(332,38,7,27,0,0,4,0),(333,38,8,31,0,0,89,0),(334,38,9,35,0,0,0.87,0),(335,39,1,1,4,0,0,0),(336,39,2,5,1,0,0,0),(337,39,3,9,6,0,0,0),(338,39,4,13,0.16,0,0,0),(339,39,5,17,2,0,0,0),(340,39,6,21,0.37,0,0,0),(341,39,7,25,1,0,0,0),(342,39,8,29,83,0,0,0),(343,39,9,33,0.62,0,0,0),(344,40,1,1,4,0,0,0),(345,40,2,8,0,0,0,1.5),(346,40,3,12,0,0,0,5),(347,40,4,16,0,0,0,0.5),(348,40,5,20,0,0,0,3),(349,40,6,24,0,0,0,0.35),(350,40,7,28,0,0,0,2),(351,40,8,32,0,0,0,85),(352,40,9,36,0,0,0,0.37),(353,41,1,1,4,0,0,0),(354,41,2,5,1,0,0,0),(355,41,3,9,6,0,0,0),(356,41,4,13,0.16,0,0,0),(357,41,5,17,2,0,0,0),(358,41,6,21,0.37,0,0,0),(359,41,7,25,1,0,0,0),(360,41,8,29,83,0,0,0),(361,41,9,33,0.62,0,0,0),(362,42,1,4,0,0,0,5),(363,42,2,8,0,0,0,1.5),(364,42,3,12,0,0,0,5),(365,42,4,16,0,0,0,0.5),(366,42,5,19,0,0,5,0),(367,42,6,23,0,0,0.75,0),(368,42,7,28,0,0,0,2),(369,42,8,32,0,0,0,85),(370,42,9,36,0,0,0,0.37),(371,43,1,2,0,7,0,0),(372,43,2,6,0,2,0,0),(373,43,3,11,0,0,3,0),(374,43,4,16,0,0,0,0.5),(375,43,5,18,0,1,0,0),(376,43,6,23,0,0,0.75,0),(377,43,7,28,0,0,0,2),(378,43,8,30,0,95,0,0),(379,43,9,34,0,0.12,0,0),(380,44,1,4,0,0,0,5),(381,44,2,8,0,0,0,1.5),(382,44,3,11,0,0,3,0),(383,44,4,15,0,0,0.83,0),(384,44,5,19,0,0,5,0),(385,44,6,23,0,0,0.75,0),(386,44,7,27,0,0,4,0),(387,44,8,31,0,0,89,0),(388,44,9,34,0,0.12,0,0),(389,45,1,1,4,0,0,0),(390,45,2,6,0,2,0,0),(391,45,3,11,0,0,3,0),(392,45,4,16,0,0,0,0.5),(393,45,5,18,0,1,0,0),(394,45,6,24,0,0,0,0.35),(395,45,7,26,0,3,0,0),(396,45,8,31,0,0,89,0),(397,45,9,36,0,0,0,0.37),(398,46,1,4,0,0,0,5),(399,46,2,8,0,0,0,1.5),(400,46,3,12,0,0,0,5),(401,46,4,16,0,0,0,0.5),(402,46,5,20,0,0,0,3),(403,46,6,24,0,0,0,0.35),(404,46,7,28,0,0,0,2),(405,46,8,32,0,0,0,85),(406,46,9,36,0,0,0,0.37),(407,47,1,3,0,0,3,0),(408,47,2,7,0,0,0.5,0),(409,47,3,11,0,0,3,0),(410,47,4,15,0,0,0.83,0),(411,47,5,19,0,0,5,0),(412,47,6,23,0,0,0.75,0),(413,47,7,28,0,0,0,2),(414,47,8,32,0,0,0,85),(415,47,9,36,0,0,0,0.37),(416,48,1,4,0,0,0,5),(417,48,2,6,0,2,0,0),(418,48,3,10,0,4,0,0),(419,48,4,14,0,0.08,0,0),(420,48,5,18,0,1,0,0),(421,48,6,22,0,0.12,0,0),(422,48,7,26,0,3,0,0),(423,48,8,30,0,95,0,0),(424,48,9,34,0,0.12,0,0),(425,49,1,1,4,0,0,0),(426,49,2,7,0,0,0.5,0),(427,49,3,12,0,0,0,5),(428,49,4,16,0,0,0,0.5),(429,49,5,19,0,0,5,0),(430,49,6,23,0,0,0.75,0),(431,49,7,27,0,0,4,0),(432,49,8,31,0,0,89,0),(433,49,9,35,0,0,0.87,0),(434,50,1,4,0,0,0,5),(435,50,2,8,0,0,0,1.5),(436,50,3,10,0,4,0,0),(437,50,4,14,0,0.08,0,0),(438,50,5,18,0,1,0,0),(439,50,6,22,0,0.12,0,0),(440,50,7,26,0,3,0,0),(441,50,8,30,0,95,0,0),(442,50,9,34,0,0.12,0,0),(443,51,1,2,0,7,0,0),(444,51,2,8,0,0,0,1.5),(445,51,3,12,0,0,0,5),(446,51,4,16,0,0,0,0.5),(447,51,5,20,0,0,0,3),(448,51,6,24,0,0,0,0.35),(449,51,7,28,0,0,0,2),(450,51,8,32,0,0,0,85),(451,51,9,36,0,0,0,0.37),(452,52,1,3,0,0,3,0),(453,52,2,8,0,0,0,1.5),(454,52,3,12,0,0,0,5),(455,52,4,16,0,0,0,0.5),(456,52,5,20,0,0,0,3),(457,52,6,24,0,0,0,0.35),(458,52,7,26,0,3,0,0),(459,52,8,30,0,95,0,0),(460,52,9,34,0,0.12,0,0),(461,53,1,4,0,0,0,5),(462,53,2,8,0,0,0,1.5),(463,53,3,12,0,0,0,5),(464,53,4,16,0,0,0,0.5),(465,53,5,20,0,0,0,3),(466,53,6,22,0,0.12,0,0),(467,53,7,28,0,0,0,2),(468,53,8,32,0,0,0,85),(469,53,9,34,0,0.12,0,0),(470,54,1,1,4,0,0,0),(471,54,2,5,1,0,0,0),(472,54,3,9,6,0,0,0),(473,54,4,16,0,0,0,0.5),(474,54,5,20,0,0,0,3),(475,54,6,24,0,0,0,0.35),(476,54,7,28,0,0,0,2),(477,54,8,32,0,0,0,85),(478,54,9,36,0,0,0,0.37),(479,55,1,1,4,0,0,0),(480,55,2,6,0,2,0,0),(481,55,3,11,0,0,3,0),(482,55,4,16,0,0,0,0.5),(483,55,5,17,2,0,0,0),(484,55,6,22,0,0.12,0,0),(485,55,7,27,0,0,4,0),(486,55,8,32,0,0,0,85),(487,55,9,33,0.62,0,0,0),(488,56,1,4,0,0,0,5),(489,56,2,8,0,0,0,1.5),(490,56,3,10,0,4,0,0),(491,56,4,14,0,0.08,0,0),(492,56,5,18,0,1,0,0),(493,56,6,22,0,0.12,0,0),(494,56,7,26,0,3,0,0),(495,56,8,30,0,95,0,0),(496,56,9,34,0,0.12,0,0),(497,57,1,3,0,0,3,0),(498,57,2,7,0,0,0.5,0),(499,57,3,11,0,0,3,0),(500,57,4,15,0,0,0.83,0),(501,57,5,19,0,0,5,0),(502,57,6,23,0,0,0.75,0),(503,57,7,27,0,0,4,0),(504,57,8,31,0,0,89,0),(505,57,9,35,0,0,0.87,0),(506,58,1,2,0,7,0,0),(507,58,2,6,0,2,0,0),(508,58,3,10,0,4,0,0),(509,58,4,14,0,0.08,0,0),(510,58,5,18,0,1,0,0),(511,58,6,22,0,0.12,0,0),(512,58,7,26,0,3,0,0),(513,58,8,30,0,95,0,0),(514,58,9,34,0,0.12,0,0),(515,59,1,2,0,7,0,0),(516,59,2,6,0,2,0,0),(517,59,3,10,0,4,0,0),(518,59,4,14,0,0.08,0,0),(519,59,5,18,0,1,0,0),(520,59,6,22,0,0.12,0,0),(521,59,7,26,0,3,0,0),(522,59,8,30,0,95,0,0),(523,59,9,34,0,0.12,0,0),(524,60,1,4,0,0,0,5),(525,60,2,8,0,0,0,1.5),(526,60,3,12,0,0,0,5),(527,60,4,16,0,0,0,0.5),(528,60,5,20,0,0,0,3),(529,60,6,24,0,0,0,0.35),(530,60,7,28,0,0,0,2),(531,60,8,32,0,0,0,85),(532,60,9,36,0,0,0,0.37),(533,61,1,2,0,7,0,0),(534,61,2,6,0,2,0,0),(535,61,3,10,0,4,0,0),(536,61,4,14,0,0.08,0,0),(537,61,5,18,0,1,0,0),(538,61,6,22,0,0.12,0,0),(539,61,7,26,0,3,0,0),(540,61,8,30,0,95,0,0),(541,61,9,34,0,0.12,0,0),(542,62,1,1,4,0,0,0),(543,62,2,7,0,0,0.5,0),(544,62,3,10,0,4,0,0),(545,62,4,15,0,0,0.83,0),(546,62,5,19,0,0,5,0),(547,62,6,23,0,0,0.75,0),(548,62,7,27,0,0,4,0),(549,62,8,31,0,0,89,0),(550,62,9,35,0,0,0.87,0),(551,63,1,2,0,7,0,0),(552,63,2,6,0,2,0,0),(553,63,3,12,0,0,0,5),(554,63,4,16,0,0,0,0.5),(555,63,5,20,0,0,0,3),(556,63,6,24,0,0,0,0.35),(557,63,7,27,0,0,4,0),(558,63,8,30,0,95,0,0),(559,63,9,34,0,0.12,0,0);
/*!40000 ALTER TABLE `hasil_test_pola_detail` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=159 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insight`
--

LOCK TABLES `insight` WRITE;
/*!40000 ALTER TABLE `insight` DISABLE KEYS */;
INSERT INTO `insight` VALUES (1,1,'Anda cenderung belajar cepat dan visual.','2025-12-14 09:16:28'),(2,2,'Anda konsisten dan mudah memahami lewat audio.','2025-12-14 09:16:28'),(3,14,'Kamu memiliki fleksibilitas tinggi. Gunakan ini untuk menyesuaikan strategi belajar berdasarkan jenis mata pelajaran (visual untuk biologi, logika untuk matematika).','2025-12-14 09:24:32'),(4,14,'Saat menghadapi materi yang sangat sulit, cobalah berganti metode (misal: dari membaca ke mendengarkan) untuk menyegarkan perspektif otak.','2025-12-14 09:24:32'),(5,14,'Terapkan teknik *Feynman Technique*: cobalah jelaskan ulang materi yang baru dipelajari dengan suara lantang seolah mengajari orang lain.','2025-12-14 09:24:32'),(6,14,'Rekam poin-poin kunci materi menggunakan suaramu sendiri dan dengarkan kembali saat waktu senggang (commuter learning).','2025-12-14 09:24:32'),(7,14,'Kamu menyerap informasi dengan cepat, namun hati-hati dengan \'lupa cepat\'. Gunakan *Spaced Repetition System* (SRS) untuk mengunci ingatan jangka panjang.','2025-12-14 09:25:22'),(8,14,'Tantang dirimu dengan soal-soal tingkat lanjut (Higher Order Thinking Skills) segera setelah paham dasar, agar tidak mudah bosan.','2025-12-14 09:25:22'),(9,14,'Terapkan teknik *Feynman Technique*: cobalah jelaskan ulang materi yang baru dipelajari dengan suara lantang seolah mengajari orang lain.','2025-12-14 09:25:23'),(10,14,'Rekam poin-poin kunci materi menggunakan suaramu sendiri dan dengarkan kembali saat waktu senggang (commuter learning).','2025-12-14 09:25:23'),(11,14,'Kekuatan utamamu adalah rutinitas. Pertahankan jadwal ini, namun sisipkan variasi materi agar otak tidak mengalami kejenuhan (plateau).','2025-12-14 09:26:21'),(12,14,'Gunakan kebiasaan baikmu untuk mulai menargetkan materi yang lebih kompleks secara bertahap (*Progressive Overload* dalam belajar).','2025-12-14 09:26:21'),(13,14,'Gunakan teknik *Active Recall* sambil bergerak (berjalan santai atau menggunakan gestur tangan) untuk menanamkan memori.','2025-12-14 09:26:22'),(14,14,'Perbanyak latihan soal (hands-on) atau simulasi kasus nyata daripada sekadar membaca teori pasif secara berulang.','2025-12-14 09:26:22'),(15,14,'Kamu menyerap informasi dengan cepat, namun hati-hati dengan \'lupa cepat\'. Gunakan *Spaced Repetition System* (SRS) untuk mengunci ingatan jangka panjang.','2025-12-14 09:40:41'),(16,14,'Tantang dirimu dengan soal-soal tingkat lanjut (Higher Order Thinking Skills) segera setelah paham dasar, agar tidak mudah bosan.','2025-12-14 09:40:41'),(17,14,'Optimalkan ingatanmu dengan teknik *Dual Coding*: gabungkan teks ringkas dengan diagram atau sketsa visual.','2025-12-14 09:40:41'),(18,14,'Sebelum masuk ke detail, lihatlah \'gambaran besar\' (Big Picture) materi melalui peta konsep atau daftar isi visual.','2025-12-14 09:40:41'),(19,14,'Kemampuan analisismu sangat baik. Cobalah hubungkan materi baru dengan pengalaman masa lalumu (*Constructivism*) untuk pemahaman yang sangat kuat.','2025-12-14 09:41:22'),(20,14,'Hati-hati dengan *Analysis Paralysis*. Tetapkan batas waktu (time-boxing) saat merenungkan sebuah konsep agar tetap produktif.','2025-12-14 09:41:22'),(21,14,'Gunakan teknik *Active Recall* sambil bergerak (berjalan santai atau menggunakan gestur tangan) untuk menanamkan memori.','2025-12-14 09:41:23'),(22,14,'Perbanyak latihan soal (hands-on) atau simulasi kasus nyata daripada sekadar membaca teori pasif secara berulang.','2025-12-14 09:41:23'),(23,16,'Kamu memiliki fleksibilitas tinggi. Gunakan ini untuk menyesuaikan strategi belajar berdasarkan jenis mata pelajaran (visual untuk biologi, logika untuk matematika).','2025-12-14 10:01:30'),(24,16,'Saat menghadapi materi yang sangat sulit, cobalah berganti metode (misal: dari membaca ke mendengarkan) untuk menyegarkan perspektif otak.','2025-12-14 10:01:30'),(25,16,'Gunakan teknik *Active Recall* sambil bergerak (berjalan santai atau menggunakan gestur tangan) untuk menanamkan memori.','2025-12-14 10:01:30'),(26,16,'Perbanyak latihan soal (hands-on) atau simulasi kasus nyata daripada sekadar membaca teori pasif secara berulang.','2025-12-14 10:01:30'),(27,16,'Kamu memiliki fleksibilitas tinggi. Gunakan ini untuk menyesuaikan strategi belajar berdasarkan jenis mata pelajaran (visual untuk biologi, logika untuk matematika).','2025-12-14 10:02:09'),(28,16,'Saat menghadapi materi yang sangat sulit, cobalah berganti metode (misal: dari membaca ke mendengarkan) untuk menyegarkan perspektif otak.','2025-12-14 10:02:09'),(29,16,'Gunakan teknik *Active Recall* sambil bergerak (berjalan santai atau menggunakan gestur tangan) untuk menanamkan memori.','2025-12-14 10:02:10'),(30,16,'Perbanyak latihan soal (hands-on) atau simulasi kasus nyata daripada sekadar membaca teori pasif secara berulang.','2025-12-14 10:02:10'),(31,16,'Kamu memiliki fleksibilitas tinggi. Gunakan ini untuk menyesuaikan strategi belajar berdasarkan jenis mata pelajaran (visual untuk biologi, logika untuk matematika).','2025-12-14 10:03:14'),(32,16,'Saat menghadapi materi yang sangat sulit, cobalah berganti metode (misal: dari membaca ke mendengarkan) untuk menyegarkan perspektif otak.','2025-12-14 10:03:14'),(33,16,'Gunakan teknik *Active Recall* sambil bergerak (berjalan santai atau menggunakan gestur tangan) untuk menanamkan memori.','2025-12-14 10:03:14'),(34,16,'Perbanyak latihan soal (hands-on) atau simulasi kasus nyata daripada sekadar membaca teori pasif secara berulang.','2025-12-14 10:03:14'),(35,17,'Kamu memiliki fleksibilitas tinggi. Gunakan ini untuk menyesuaikan strategi belajar berdasarkan jenis mata pelajaran (visual untuk biologi, logika untuk matematika).','2025-12-14 10:44:07'),(36,17,'Saat menghadapi materi yang sangat sulit, cobalah berganti metode (misal: dari membaca ke mendengarkan) untuk menyegarkan perspektif otak.','2025-12-14 10:44:07'),(37,17,'Optimalkan ingatanmu dengan teknik *Dual Coding*: gabungkan teks ringkas dengan diagram atau sketsa visual.','2025-12-14 10:44:08'),(38,17,'Sebelum masuk ke detail, lihatlah \'gambaran besar\' (Big Picture) materi melalui peta konsep atau daftar isi visual.','2025-12-14 10:44:08'),(39,18,'Kamu menyerap informasi dengan cepat, namun hati-hati dengan \'lupa cepat\'. Gunakan *Spaced Repetition System* (SRS) untuk mengunci ingatan jangka panjang.','2025-12-14 11:18:25'),(40,18,'Tantang dirimu dengan soal-soal tingkat lanjut (Higher Order Thinking Skills) segera setelah paham dasar, agar tidak mudah bosan.','2025-12-14 11:18:25'),(41,18,'Terapkan teknik *Feynman Technique*: cobalah jelaskan ulang materi yang baru dipelajari dengan suara lantang seolah mengajari orang lain.','2025-12-14 11:18:26'),(42,18,'Rekam poin-poin kunci materi menggunakan suaramu sendiri dan dengarkan kembali saat waktu senggang (commuter learning).','2025-12-14 11:18:26'),(43,19,'Kamu menyerap informasi dengan cepat, namun hati-hati dengan \'lupa cepat\'. Gunakan *Spaced Repetition System* (SRS) untuk mengunci ingatan jangka panjang.','2025-12-14 11:32:43'),(44,19,'Tantang dirimu dengan soal-soal tingkat lanjut (Higher Order Thinking Skills) segera setelah paham dasar, agar tidak mudah bosan.','2025-12-14 11:32:43'),(45,19,'Optimalkan ingatanmu dengan teknik *Dual Coding*: gabungkan teks ringkas dengan diagram atau sketsa visual.','2025-12-14 11:32:43'),(46,19,'Sebelum masuk ke detail, lihatlah \'gambaran besar\' (Big Picture) materi melalui peta konsep atau daftar isi visual.','2025-12-14 11:32:43'),(47,6,'Kamu memiliki fleksibilitas tinggi. Gunakan ini untuk menyesuaikan strategi belajar berdasarkan jenis mata pelajaran (visual untuk biologi, logika untuk matematika).','2025-12-14 11:45:51'),(48,6,'Saat menghadapi materi yang sangat sulit, cobalah berganti metode (misal: dari membaca ke mendengarkan) untuk menyegarkan perspektif otak.','2025-12-14 11:45:51'),(49,6,'Gunakan teknik *Active Recall* sambil bergerak (berjalan santai atau menggunakan gestur tangan) untuk menanamkan memori.','2025-12-14 11:45:51'),(50,6,'Perbanyak latihan soal (hands-on) atau simulasi kasus nyata daripada sekadar membaca teori pasif secara berulang.','2025-12-14 11:45:51'),(51,8,'Kemampuan analisismu sangat baik. Cobalah hubungkan materi baru dengan pengalaman masa lalumu (*Constructivism*) untuk pemahaman yang sangat kuat.','2025-12-14 12:14:30'),(52,8,'Hati-hati dengan *Analysis Paralysis*. Tetapkan batas waktu (time-boxing) saat merenungkan sebuah konsep agar tetap produktif.','2025-12-14 12:14:30'),(53,8,'Gunakan teknik *Active Recall* sambil bergerak (berjalan santai atau menggunakan gestur tangan) untuk menanamkan memori.','2025-12-14 12:14:30'),(54,8,'Perbanyak latihan soal (hands-on) atau simulasi kasus nyata daripada sekadar membaca teori pasif secara berulang.','2025-12-14 12:14:30'),(55,18,'Kamu memiliki fleksibilitas tinggi. Gunakan ini untuk menyesuaikan strategi belajar berdasarkan jenis mata pelajaran (visual untuk biologi, logika untuk matematika).','2025-12-14 15:58:47'),(56,18,'Saat menghadapi materi yang sangat sulit, cobalah berganti metode (misal: dari membaca ke mendengarkan) untuk menyegarkan perspektif otak.','2025-12-14 15:58:47'),(57,18,'Gunakan teknik *Active Recall* sambil bergerak (berjalan santai atau menggunakan gestur tangan) untuk menanamkan memori.','2025-12-14 15:58:47'),(58,18,'Perbanyak latihan soal (hands-on) atau simulasi kasus nyata daripada sekadar membaca teori pasif secara berulang.','2025-12-14 15:58:47'),(59,20,'Kekuatan utamamu adalah rutinitas. Pertahankan jadwal ini, namun sisipkan variasi materi agar otak tidak mengalami kejenuhan (plateau).','2025-12-14 16:01:04'),(60,20,'Gunakan kebiasaan baikmu untuk mulai menargetkan materi yang lebih kompleks secara bertahap (*Progressive Overload* dalam belajar).','2025-12-14 16:01:04'),(61,20,'Optimalkan ingatanmu dengan teknik *Dual Coding*: gabungkan teks ringkas dengan diagram atau sketsa visual.','2025-12-14 16:01:04'),(62,20,'Sebelum masuk ke detail, lihatlah \'gambaran besar\' (Big Picture) materi melalui peta konsep atau daftar isi visual.','2025-12-14 16:01:04'),(63,21,'Kamu memiliki fleksibilitas tinggi. Gunakan ini untuk menyesuaikan strategi belajar berdasarkan jenis mata pelajaran (visual untuk biologi, logika untuk matematika).','2025-12-14 16:05:10'),(64,21,'Saat menghadapi materi yang sangat sulit, cobalah berganti metode (misal: dari membaca ke mendengarkan) untuk menyegarkan perspektif otak.','2025-12-14 16:05:10'),(65,21,'Gunakan teknik *Active Recall* sambil bergerak (berjalan santai atau menggunakan gestur tangan) untuk menanamkan memori.','2025-12-14 16:05:10'),(66,21,'Perbanyak latihan soal (hands-on) atau simulasi kasus nyata daripada sekadar membaca teori pasif secara berulang.','2025-12-14 16:05:10'),(67,22,'Kekuatan utamamu adalah rutinitas. Pertahankan jadwal ini, namun sisipkan variasi materi agar otak tidak mengalami kejenuhan (plateau).','2025-12-14 16:56:16'),(68,22,'Gunakan kebiasaan baikmu untuk mulai menargetkan materi yang lebih kompleks secara bertahap (*Progressive Overload* dalam belajar).','2025-12-14 16:56:16'),(69,22,'Optimalkan ingatanmu dengan teknik *Dual Coding*: gabungkan teks ringkas dengan diagram atau sketsa visual.','2025-12-14 16:56:16'),(70,22,'Sebelum masuk ke detail, lihatlah \'gambaran besar\' (Big Picture) materi melalui peta konsep atau daftar isi visual.','2025-12-14 16:56:16'),(71,11,'Kemampuan analisismu sangat baik. Cobalah hubungkan materi baru dengan pengalaman masa lalumu (*Constructivism*) untuk pemahaman yang sangat kuat.','2025-12-15 03:40:35'),(72,11,'Hati-hati dengan *Analysis Paralysis*. Tetapkan batas waktu (time-boxing) saat merenungkan sebuah konsep agar tetap produktif.','2025-12-15 03:40:35'),(73,11,'Gunakan teknik *Active Recall* sambil bergerak (berjalan santai atau menggunakan gestur tangan) untuk menanamkan memori.','2025-12-15 03:40:35'),(74,11,'Perbanyak latihan soal (hands-on) atau simulasi kasus nyata daripada sekadar membaca teori pasif secara berulang.','2025-12-15 03:40:35'),(75,23,'Kamu memiliki fleksibilitas tinggi. Gunakan ini untuk menyesuaikan strategi belajar berdasarkan jenis mata pelajaran (visual untuk biologi, logika untuk matematika).','2025-12-15 04:05:06'),(76,23,'Saat menghadapi materi yang sangat sulit, cobalah berganti metode (misal: dari membaca ke mendengarkan) untuk menyegarkan perspektif otak.','2025-12-15 04:05:06'),(77,23,'Optimalkan ingatanmu dengan teknik *Dual Coding*: gabungkan teks ringkas dengan diagram atau sketsa visual.','2025-12-15 04:05:07'),(78,23,'Sebelum masuk ke detail, lihatlah \'gambaran besar\' (Big Picture) materi melalui peta konsep atau daftar isi visual.','2025-12-15 04:05:07'),(79,23,'Kemampuan analisismu sangat baik. Cobalah hubungkan materi baru dengan pengalaman masa lalumu (*Constructivism*) untuk pemahaman yang sangat kuat.','2025-12-15 06:55:02'),(80,23,'Hati-hati dengan *Analysis Paralysis*. Tetapkan batas waktu (time-boxing) saat merenungkan sebuah konsep agar tetap produktif.','2025-12-15 06:55:02'),(81,23,'Terapkan teknik *Feynman Technique*: cobalah jelaskan ulang materi yang baru dipelajari dengan suara lantang seolah mengajari orang lain.','2025-12-15 06:55:02'),(82,23,'Rekam poin-poin kunci materi menggunakan suaramu sendiri dan dengarkan kembali saat waktu senggang (commuter learning).','2025-12-15 06:55:02'),(83,24,'Kamu memiliki fleksibilitas tinggi. Gunakan ini untuk menyesuaikan strategi belajar berdasarkan jenis mata pelajaran (visual untuk biologi, logika untuk matematika).','2025-12-15 12:18:19'),(84,24,'Saat menghadapi materi yang sangat sulit, cobalah berganti metode (misal: dari membaca ke mendengarkan) untuk menyegarkan perspektif otak.','2025-12-15 12:18:19'),(85,24,'Optimalkan ingatanmu dengan teknik *Dual Coding*: gabungkan teks ringkas dengan diagram atau sketsa visual.','2025-12-15 12:18:19'),(86,24,'Sebelum masuk ke detail, lihatlah \'gambaran besar\' (Big Picture) materi melalui peta konsep atau daftar isi visual.','2025-12-15 12:18:19'),(87,6,'Kamu memiliki fleksibilitas tinggi. Gunakan ini untuk menyesuaikan strategi belajar berdasarkan jenis mata pelajaran (visual untuk biologi, logika untuk matematika).','2025-12-15 17:35:55'),(88,6,'Saat menghadapi materi yang sangat sulit, cobalah berganti metode (misal: dari membaca ke mendengarkan) untuk menyegarkan perspektif otak.','2025-12-15 17:35:55'),(89,6,'Gunakan teknik *Active Recall* sambil bergerak (berjalan santai atau menggunakan gestur tangan) untuk menanamkan memori.','2025-12-15 17:35:55'),(90,6,'Perbanyak latihan soal (hands-on) atau simulasi kasus nyata daripada sekadar membaca teori pasif secara berulang.','2025-12-15 17:35:55'),(91,26,'Kemampuan analisismu sangat baik. Cobalah hubungkan materi baru dengan pengalaman masa lalumu (*Constructivism*) untuk pemahaman yang sangat kuat.','2025-12-15 20:22:24'),(92,26,'Hati-hati dengan *Analysis Paralysis*. Tetapkan batas waktu (time-boxing) saat merenungkan sebuah konsep agar tetap produktif.','2025-12-15 20:22:24'),(93,26,'Gunakan teknik *Active Recall* sambil bergerak (berjalan santai atau menggunakan gestur tangan) untuk menanamkan memori.','2025-12-15 20:22:24'),(94,26,'Perbanyak latihan soal (hands-on) atau simulasi kasus nyata daripada sekadar membaca teori pasif secara berulang.','2025-12-15 20:22:24'),(95,26,'Kamu menyerap informasi dengan cepat, namun hati-hati dengan \'lupa cepat\'. Gunakan *Spaced Repetition System* (SRS) untuk mengunci ingatan jangka panjang.','2025-12-15 21:33:33'),(96,26,'Tantang dirimu dengan soal-soal tingkat lanjut (Higher Order Thinking Skills) segera setelah paham dasar, agar tidak mudah bosan.','2025-12-15 21:33:33'),(97,26,'Terapkan teknik *Feynman Technique*: cobalah jelaskan ulang materi yang baru dipelajari dengan suara lantang seolah mengajari orang lain.','2025-12-15 21:33:33'),(98,26,'Rekam poin-poin kunci materi menggunakan suaramu sendiri dan dengarkan kembali saat waktu senggang (commuter learning).','2025-12-15 21:33:33'),(99,27,'Kemampuan analisismu sangat baik. Cobalah hubungkan materi baru dengan pengalaman masa lalumu (*Constructivism*) untuk pemahaman yang sangat kuat.','2025-12-15 22:08:31'),(100,27,'Hati-hati dengan *Analysis Paralysis*. Tetapkan batas waktu (time-boxing) saat merenungkan sebuah konsep agar tetap produktif.','2025-12-15 22:08:31'),(101,27,'Gunakan teknik *Active Recall* sambil bergerak (berjalan santai atau menggunakan gestur tangan) untuk menanamkan memori.','2025-12-15 22:08:31'),(102,27,'Perbanyak latihan soal (hands-on) atau simulasi kasus nyata daripada sekadar membaca teori pasif secara berulang.','2025-12-15 22:08:31'),(103,6,'Kamu menyerap informasi dengan cepat, namun hati-hati dengan \'lupa cepat\'. Gunakan *Spaced Repetition System* (SRS) untuk mengunci ingatan jangka panjang.','2025-12-17 08:37:29'),(104,6,'Tantang dirimu dengan soal-soal tingkat lanjut (Higher Order Thinking Skills) segera setelah paham dasar, agar tidak mudah bosan.','2025-12-17 08:37:29'),(105,6,'Optimalkan ingatanmu dengan teknik *Dual Coding*: gabungkan teks ringkas dengan diagram atau sketsa visual.','2025-12-17 08:37:29'),(106,6,'Sebelum masuk ke detail, lihatlah \'gambaran besar\' (Big Picture) materi melalui peta konsep atau daftar isi visual.','2025-12-17 08:37:29'),(107,31,'Kamu memiliki fleksibilitas tinggi. Gunakan ini untuk menyesuaikan strategi belajar berdasarkan jenis mata pelajaran (visual untuk biologi, logika untuk matematika).','2025-12-17 18:19:31'),(108,31,'Saat menghadapi materi yang sangat sulit, cobalah berganti metode (misal: dari membaca ke mendengarkan) untuk menyegarkan perspektif otak.','2025-12-17 18:19:31'),(109,31,'Terapkan teknik *Feynman Technique*: cobalah jelaskan ulang materi yang baru dipelajari dengan suara lantang seolah mengajari orang lain.','2025-12-17 18:19:32'),(110,31,'Rekam poin-poin kunci materi menggunakan suaramu sendiri dan dengarkan kembali saat waktu senggang (commuter learning).','2025-12-17 18:19:32'),(111,32,'Kamu memiliki fleksibilitas tinggi. Gunakan ini untuk menyesuaikan strategi belajar berdasarkan jenis mata pelajaran (visual untuk biologi, logika untuk matematika).','2025-12-17 21:51:57'),(112,32,'Saat menghadapi materi yang sangat sulit, cobalah berganti metode (misal: dari membaca ke mendengarkan) untuk menyegarkan perspektif otak.','2025-12-17 21:51:57'),(113,32,'Optimalkan ingatanmu dengan teknik *Dual Coding*: gabungkan teks ringkas dengan diagram atau sketsa visual.','2025-12-17 21:51:57'),(114,32,'Sebelum masuk ke detail, lihatlah \'gambaran besar\' (Big Picture) materi melalui peta konsep atau daftar isi visual.','2025-12-17 21:51:57'),(115,33,'Kamu memiliki fleksibilitas tinggi. Gunakan ini untuk menyesuaikan strategi belajar berdasarkan jenis mata pelajaran (visual untuk biologi, logika untuk matematika).','2025-12-17 22:11:35'),(116,33,'Saat menghadapi materi yang sangat sulit, cobalah berganti metode (misal: dari membaca ke mendengarkan) untuk menyegarkan perspektif otak.','2025-12-17 22:11:35'),(117,33,'Optimalkan ingatanmu dengan teknik *Dual Coding*: gabungkan teks ringkas dengan diagram atau sketsa visual.','2025-12-17 22:11:35'),(118,33,'Sebelum masuk ke detail, lihatlah \'gambaran besar\' (Big Picture) materi melalui peta konsep atau daftar isi visual.','2025-12-17 22:11:35'),(119,34,'Kamu memiliki fleksibilitas tinggi. Gunakan ini untuk menyesuaikan strategi belajar berdasarkan jenis mata pelajaran (visual untuk biologi, logika untuk matematika).','2025-12-17 22:15:02'),(120,34,'Saat menghadapi materi yang sangat sulit, cobalah berganti metode (misal: dari membaca ke mendengarkan) untuk menyegarkan perspektif otak.','2025-12-17 22:15:02'),(121,34,'Gunakan teknik *Active Recall* sambil bergerak (berjalan santai atau menggunakan gestur tangan) untuk menanamkan memori.','2025-12-17 22:15:02'),(122,34,'Perbanyak latihan soal (hands-on) atau simulasi kasus nyata daripada sekadar membaca teori pasif secara berulang.','2025-12-17 22:15:02'),(123,36,'Kamu memiliki fleksibilitas tinggi. Gunakan ini untuk menyesuaikan strategi belajar berdasarkan jenis mata pelajaran (visual untuk biologi, logika untuk matematika).','2025-12-19 09:24:51'),(124,36,'Saat menghadapi materi yang sangat sulit, cobalah berganti metode (misal: dari membaca ke mendengarkan) untuk menyegarkan perspektif otak.','2025-12-19 09:24:51'),(125,36,'Gunakan teknik *Active Recall* sambil bergerak (berjalan santai atau menggunakan gestur tangan) untuk menanamkan memori.','2025-12-19 09:24:51'),(126,36,'Perbanyak latihan soal (hands-on) atau simulasi kasus nyata daripada sekadar membaca teori pasif secara berulang.','2025-12-19 09:24:51'),(127,6,'Kamu menyerap informasi dengan cepat, namun hati-hati dengan \'lupa cepat\'. Gunakan *Spaced Repetition System* (SRS) untuk mengunci ingatan jangka panjang.','2025-12-20 15:09:34'),(128,6,'Tantang dirimu dengan soal-soal tingkat lanjut (Higher Order Thinking Skills) segera setelah paham dasar, agar tidak mudah bosan.','2025-12-20 15:09:34'),(129,6,'Gunakan teknik *Active Recall* sambil bergerak (berjalan santai atau menggunakan gestur tangan) untuk menanamkan memori.','2025-12-20 15:09:34'),(130,6,'Perbanyak latihan soal (hands-on) atau simulasi kasus nyata daripada sekadar membaca teori pasif secara berulang.','2025-12-20 15:09:34'),(131,6,'Kemampuan analisismu sangat baik. Cobalah hubungkan materi baru dengan pengalaman masa lalumu (*Constructivism*) untuk pemahaman yang sangat kuat.','2025-12-22 08:45:20'),(132,6,'Hati-hati dengan *Analysis Paralysis*. Tetapkan batas waktu (time-boxing) saat merenungkan sebuah konsep agar tetap produktif.','2025-12-22 08:45:20'),(133,6,'Gunakan teknik *Active Recall* sambil bergerak (berjalan santai atau menggunakan gestur tangan) untuk menanamkan memori.','2025-12-22 08:45:20'),(134,6,'Perbanyak latihan soal (hands-on) atau simulasi kasus nyata daripada sekadar membaca teori pasif secara berulang.','2025-12-22 08:45:20'),(135,6,'Kamu menyerap informasi dengan cepat, namun hati-hati dengan \'lupa cepat\'. Gunakan *Spaced Repetition System* (SRS) untuk mengunci ingatan jangka panjang.','2025-12-24 16:53:26'),(136,6,'Tantang dirimu dengan soal-soal tingkat lanjut (Higher Order Thinking Skills) segera setelah paham dasar, agar tidak mudah bosan.','2025-12-24 16:53:26'),(137,6,'Optimalkan ingatanmu dengan teknik *Dual Coding*: gabungkan teks ringkas dengan diagram atau sketsa visual.','2025-12-24 16:53:27'),(138,6,'Sebelum masuk ke detail, lihatlah \'gambaran besar\' (Big Picture) materi melalui peta konsep atau daftar isi visual.','2025-12-24 16:53:27'),(139,6,'Kamu menyerap informasi dengan cepat, namun hati-hati dengan \'lupa cepat\'. Gunakan *Spaced Repetition System* (SRS) untuk mengunci ingatan jangka panjang.','2025-12-26 18:01:46'),(140,6,'Tantang dirimu dengan soal-soal tingkat lanjut (Higher Order Thinking Skills) segera setelah paham dasar, agar tidak mudah bosan.','2025-12-26 18:01:46'),(141,6,'Optimalkan ingatanmu dengan teknik *Dual Coding*: gabungkan teks ringkas dengan diagram atau sketsa visual.','2025-12-26 18:01:46'),(142,6,'Sebelum masuk ke detail, lihatlah \'gambaran besar\' (Big Picture) materi melalui peta konsep atau daftar isi visual.','2025-12-26 18:01:46'),(143,6,'Kamu memiliki fleksibilitas tinggi. Gunakan ini untuk menyesuaikan strategi belajar berdasarkan jenis mata pelajaran (visual untuk biologi, logika untuk matematika).','2025-12-26 22:19:45'),(144,6,'Saat menghadapi materi yang sangat sulit, cobalah berganti metode (misal: dari membaca ke mendengarkan) untuk menyegarkan perspektif otak.','2025-12-26 22:19:45'),(145,6,'Gunakan teknik *Active Recall* sambil bergerak (berjalan santai atau menggunakan gestur tangan) untuk menanamkan memori.','2025-12-26 22:19:47'),(146,6,'Perbanyak latihan soal (hands-on) atau simulasi kasus nyata daripada sekadar membaca teori pasif secara berulang.','2025-12-26 22:19:47'),(147,6,'Kamu menyerap informasi dengan cepat, namun hati-hati dengan \'lupa cepat\'. Gunakan *Spaced Repetition System* (SRS) untuk mengunci ingatan jangka panjang.','2025-12-26 22:20:15'),(148,6,'Tantang dirimu dengan soal-soal tingkat lanjut (Higher Order Thinking Skills) segera setelah paham dasar, agar tidak mudah bosan.','2025-12-26 22:20:15'),(149,6,'Terapkan teknik *Feynman Technique*: cobalah jelaskan ulang materi yang baru dipelajari dengan suara lantang seolah mengajari orang lain.','2025-12-26 22:20:21'),(150,6,'Rekam poin-poin kunci materi menggunakan suaramu sendiri dan dengarkan kembali saat waktu senggang (commuter learning).','2025-12-26 22:20:21'),(151,40,'Kemampuan analisismu sangat baik. Cobalah hubungkan materi baru dengan pengalaman masa lalumu (*Constructivism*) untuk pemahaman yang sangat kuat.','2025-12-27 08:24:58'),(152,40,'Hati-hati dengan *Analysis Paralysis*. Tetapkan batas waktu (time-boxing) saat merenungkan sebuah konsep agar tetap produktif.','2025-12-27 08:24:58'),(153,40,'Terapkan teknik *Feynman Technique*: cobalah jelaskan ulang materi yang baru dipelajari dengan suara lantang seolah mengajari orang lain.','2025-12-27 08:24:58'),(154,40,'Rekam poin-poin kunci materi menggunakan suaramu sendiri dan dengarkan kembali saat waktu senggang (commuter learning).','2025-12-27 08:24:58'),(155,6,'Kamu memiliki fleksibilitas tinggi. Gunakan ini untuk menyesuaikan strategi belajar berdasarkan jenis mata pelajaran (visual untuk biologi, logika untuk matematika).','2026-01-04 13:45:28'),(156,6,'Saat menghadapi materi yang sangat sulit, cobalah berganti metode (misal: dari membaca ke mendengarkan) untuk menyegarkan perspektif otak.','2026-01-04 13:45:28'),(157,6,'Terapkan teknik *Feynman Technique*: cobalah jelaskan ulang materi yang baru dipelajari dengan suara lantang seolah mengajari orang lain.','2026-01-04 13:45:28'),(158,6,'Rekam poin-poin kunci materi menggunakan suaramu sendiri dan dengarkan kembali saat waktu senggang (commuter learning).','2026-01-04 13:45:28');
/*!40000 ALTER TABLE `insight` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `motd`
--

LOCK TABLES `motd` WRITE;
/*!40000 ALTER TABLE `motd` DISABLE KEYS */;
INSERT INTO `motd` VALUES (1,'Selamat Datang di Sistem Asah Learning Insight!'),(2,'Fitur Prediksi AI untuk Pola Belajar kini sudah aktif.'),(3,'Tips: Cobalah tes Gaya Belajar untuk mengetahui metode belajar terbaikmu.');
/*!40000 ALTER TABLE `motd` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `pilihan_gaya`
--

LOCK TABLES `pilihan_gaya` WRITE;
/*!40000 ALTER TABLE `pilihan_gaya` DISABLE KEYS */;
INSERT INTO `pilihan_gaya` VALUES (1,1,'Melihat gambar, diagram, atau video',5,1,1),(2,1,'Mendengarkan penjelasan dosen atau diskusi',1,5,1),(3,1,'Mempraktikkan langsung atau melakukan simulasi',1,1,5),(4,2,'Menuliskannya untuk melihat apakah \"terlihat benar\"',5,1,2),(5,2,'Mengucapkannya untuk mendengar apakah \"terdengar benar\"',1,5,1),(6,2,'Mengetiknya atau menulisnya di udara (memori otot)',1,1,5),(7,3,'Suasana yang berantakan atau banyak gerakan',5,1,1),(8,3,'Suara bising atau percakapan orang lain',1,5,1),(9,3,'Duduk diam terlalu lama tanpa bergerak',1,1,5),(10,4,'Melihat panduan tertulis atau peta',5,1,1),(11,4,'Mendengarkan seseorang menjelaskan langkah-langkahnya',1,5,1),(12,4,'Langsung mencoba sendiri sambil dipandu',1,1,5),(13,5,'Membaca buku atau menonton film',5,1,2),(14,5,'Mendengarkan musik atau podcast',1,5,1),(15,5,'Berolahraga atau membuat sesuatu (kerajinan)',1,1,5),(16,6,'Membuat ringkasan berwarna atau Mind Map',5,1,2),(17,6,'Membaca catatan dengan keras atau diskusi teman',1,5,1),(18,6,'Berjalan-jalan sambil menghafal atau menulis ulang',1,1,5);
/*!40000 ALTER TABLE `pilihan_gaya` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `pilihan_pola`
--

LOCK TABLES `pilihan_pola` WRITE;
/*!40000 ALTER TABLE `pilihan_pola` DISABLE KEYS */;
INSERT INTO `pilihan_pola` VALUES (1,1,'Saya cenderung memiliki pola teratur, biasanya mempelajari sekitar 3-5 materi setiap kali belajar.',4,0,0,0),(2,1,'Gaya saya lebih cepat, dalam satu sesi bisa menuntaskan 6 materi atau bahkan lebih.',0,7,0,0),(3,1,'Saya lebih suka mendalami, sehingga biasanya hanya 2-4 materi namun dengan fokus yang kuat.',0,0,3,0),(4,1,'Pola saya seimbang, rata-rata 4-6 materi per sesi dengan jadwal yang fleksibel.',0,0,0,5),(5,2,'Biasanya saya menuntaskan sekitar 1 materi per jam, dengan alur belajar yang cukup nyaman.',1,0,0,0),(6,2,'Dalam tempo cepat, saya bisa menguasai sekitar 1 sampai 2 materi per jam, tanpa banyak pengulangan.',0,2,0,0),(7,2,'Saya lebih suka mendalami, sehingga hanya setengah hingga 1 materi per jam, tetapi benar-benar dipahami secara menyeluruh.',0,0,0.5,0),(8,2,'Rata-rata saya mampu menyelesaikan sekitar 1 hingga 1,5 materi per jam, cukup fleksibel menyesuaikan kondisi belajar.',0,0,0,1.5),(9,3,'Hampir setiap hari saya meluangkan waktu belajar, biasanya antara 5 hingga 7 kali dalam seminggu supaya tetap terbiasa dan tidak mudah lupa.',6,0,0,0),(10,3,'Saya lebih sering belajar secara cepat, sekitar 3-5 kali seminggu, biasanya menyesuaikan waktu luang dan energi yang ada.',0,4,0,0),(11,3,'Belajar bagi saya lebih mendalam, sehingga frekuensinya lebih sedikit, hanya 3-4 kali seminggu namun dengan durasi panjang.',0,0,3,0),(12,3,'Saya menjaga keseimbangan, rata-rata 4-5 kali seminggu, menyesuaikan dengan jadwal dan kebutuhan.',0,0,0,5),(13,4,'Biasanya saya belajar sekitar 1-2 jam, cukup nyaman dan tidak terasa terlalu berat.',0.16,0,0,0),(14,4,'Sesi belajar saya cenderung singkat, sekitar 1-1,5 jam, lebih suka sesi singkat tapi fokus.',0,0.08,0,0),(15,4,'Kadang saya bisa belajar lebih lama, sekitar 3-4 jam, karena ingin mendalami materi secara menyeluruh.',0,0,0.83,0),(16,4,'Rata-rata saya meluangkan waktu sekitar 2-3 jam, kadang serius, kadang santai, tergantung kebutuhan.',0,0,0,0.5),(17,5,'Saya biasanya mengulang materi sekitar 2-3 kali dalam seminggu, cukup rutin supaya tetap ingat dan tidak mudah lupa.',2,0,0,0),(18,5,'Pengulangan saya jarang, mungkin hanya sekali seminggu atau hampir tidak pernah mengulang, karena lebih fokus pada materi baru.',0,1,0,0),(19,5,'Saya sering kembali ke materi lama, bisa 4 kali atau lebih dalam seminggu, untuk memastikan pemahaman benar-benar mendalam.',0,0,5,0),(20,5,'Rata-rata saya melakukan pengulangan 2-3 kali seminggu, kadang fokus ke hal baru, kadang balik lagi ke materi lama supaya tetap seimbang.',0,0,0,3),(21,6,'Biasanya saya menyelesaikan submission dalam waktu sekitar 4 sampai 6 jam, cukup stabil dan tidak terlalu terburu-buru.',0.37,0,0,0),(22,6,'Saya cenderung lebih cepat, umumnya hanya membutuhkan sekitar 2 sampai 4 jam untuk menyelesaikan submission.',0,0.12,0,0),(23,6,'Kadang saya menghabiskan waktu cukup lama, bisa mencapai 6 sampai 10 jam, karena ingin meninjau dan mendalami setiap detail sebelum mengumpulkan.',0,0,0.75,0),(24,6,'Rata-rata saya membutuhkan sekitar 4 sampai 6 jam, kadang fokus pada ketelitian, kadang lebih ke efisiensi, jadi hasilnya tetap seimbang.',0,0,0,0.35),(25,7,'Biasanya saya dapat sekitar 1 sampai 3 bintang, hasilnya cukup stabil walaupun kadang naik turun.',1,0,0,0),(26,7,'Saya sering meraih 2 sampai 4 bintang, karena biasanya bisa menyelesaikan submission dengan cepat dan lancar.',0,3,0,0),(27,7,'Nilai saya umumnya ada di kisaran 2 sampai 4 bintang, karena saya lebih teliti dan suka mendalami detail sebelum selesai.',0,0,4,0),(28,7,'Rata-rata saya memperoleh 1 sampai 3 bintang, kadang hasilnya bagus, kadang biasa saja, tapi tetap seimbang.',0,0,0,2),(29,8,'Nilai saya biasanya ada di kisaran 75-85%, cukup stabil walaupun kadang naik turun.',83,0,0,0),(30,8,'Saya sering dapat nilai sekitar 85-95%, karena biasanya bisa cepat memahami soal-soal kuis.',0,95,0,0),(31,8,'Nilai saya umumnya berada di 80-95%, biasanya karena saya lebih teliti dan suka mendalami materi sebelum menjawab.',0,0,89,0),(32,8,'Rata-rata nilai saya sekitar 80-90%, biasanya cukup seimbang—kadang cepat selesai, kadang lebih hati-hati, tapi hasilnya tetap oke.',0,0,0,85),(33,9,'Biasanya saya menyelesaikan kuis dalam waktu sekitar 15-20 menit, umumnya cukup tenang dan tidak terburu-buru.',0.62,0,0,0),(34,9,'Saya cenderung lebih cepat, umumnya hanya membutuhkan sekitar 5-10 menit untuk menuntaskan kuis.',0,0.12,0,0),(35,9,'Kadang saya menghabiskan waktu lebih lama, sekitar 20-25 menit, karena saya suka meninjau kembali setiap soal dengan teliti.',0,0,0.87,0),(36,9,'Rata-rata saya menyelesaikan kuis dalam waktu 10-15 menit, kadang cepat, kadang lebih hati-hati, tapi tetap selesai dengan baik.',0,0,0,0.37);
/*!40000 ALTER TABLE `pilihan_pola` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `soal_gaya`
--

LOCK TABLES `soal_gaya` WRITE;
/*!40000 ALTER TABLE `soal_gaya` DISABLE KEYS */;
INSERT INTO `soal_gaya` VALUES (1,1,'Apa yang paling membantu Anda saat belajar hal baru?'),(2,1,'Jika Anda lupa mengeja sebuah kata, apa yang Anda lakukan?'),(3,1,'Saat Anda sedang berkonsentrasi, apa yang paling mengganggu?'),(4,1,'Bagaimana cara terbaik bagi Anda untuk mengikuti instruksi?'),(5,1,'Ketika Anda memiliki waktu luang, Anda lebih suka?'),(6,1,'Saat mempersiapkan ujian, apa strategi utama Anda?');
/*!40000 ALTER TABLE `soal_gaya` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `soal_pola`
--

LOCK TABLES `soal_pola` WRITE;
/*!40000 ALTER TABLE `soal_pola` DISABLE KEYS */;
INSERT INTO `soal_pola` VALUES (1,1,'Dalam satu sesi belajar berapa banyak materi biasanya Anda pelajari?'),(2,1,'Dalam satu jam belajar, berapa banyak materi biasanya Anda kuasai?'),(3,1,'Dalam satu minggu, seberapa sering Anda biasanya melakukan sesi belajar?'),(4,1,'Dalam satu sesi belajar, berapa lama biasanya Anda meluangkan waktu?'),(5,1,'Dalam satu minggu, seberapa sering Anda biasanya mengulang kembali materi yang sudah dipelajari?'),(6,1,'Berapa lama biasanya Anda membutuhkan waktu untuk mengerjakan submission?'),(7,1,'Biasanya berapa bintang yang Anda peroleh dari hasil submission Anda?'),(8,1,'Biasanya, berapa persen nilai kuis yang Anda peroleh?'),(9,1,'Berapa lama waktu yang biasanya Anda perlukan untuk menyelesaikan satu kuis?');
/*!40000 ALTER TABLE `soal_pola` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `test_gaya`
--

LOCK TABLES `test_gaya` WRITE;
/*!40000 ALTER TABLE `test_gaya` DISABLE KEYS */;
INSERT INTO `test_gaya` VALUES (1,'Tes Gaya Belajar Dasar');
/*!40000 ALTER TABLE `test_gaya` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `test_pola`
--

LOCK TABLES `test_pola` WRITE;
/*!40000 ALTER TABLE `test_pola` DISABLE KEYS */;
INSERT INTO `test_pola` VALUES (1,'Tes Pola Belajar Dasar');
/*!40000 ALTER TABLE `test_pola` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'andi@example.com','andi','$2b$10$YourHashForPass123Here',NULL,'user','visual','fast','2025-12-14 01:17:41','2025-12-14 01:17:41',NULL),(2,'budi@example.com','budi','$2b$10$YourHashForPass123Here',NULL,'user','auditori','consistent','2025-12-14 01:17:41','2025-12-14 01:17:41',NULL),(3,'sari@example.com','sari','$2b$10$YourHashForPass123Here',NULL,'user','kinestetik','reflective','2025-12-14 01:17:41','2025-12-14 01:17:41',NULL),(4,'admin@example.com','admin','$2b$10$YourHashForAdminPassHere',NULL,'admin','visual','balanced','2025-12-14 01:17:41','2025-12-14 01:17:41',NULL),(5,'tina@example.com','tina','$2b$10$YourHashForPass123Here',NULL,'user','auditori','fast','2025-12-14 01:17:41','2025-12-14 01:17:41',NULL),(6,'niokagi@gmail.com','niokagi','$2b$10$scuQw5vEEMZ1tGQPqlQaYe2AYhbJtEl9SccBT90hJU7cJMIz97y8G',NULL,'user','auditori','balanced','2025-12-14 01:18:12','2026-01-14 10:21:57',NULL),(7,'tesemail@example.com','testusername','$2b$10$SxGIDU/Dr5Xny6rD1flT4OHP3c028G6CpmDd4umwn5YnlE9rsSdry',NULL,'user','visual','fast','2025-12-14 04:23:29','2025-12-14 04:50:40',NULL),(8,'boistudent1@gmail.com','Heri','$2b$10$Il2Vrw3XfTwCXm8MuraTu.Da4FSVVKsvIWtnKH.L6u1luitczlu9C',NULL,'user','kinestetik','reflective','2025-12-14 04:36:10','2025-12-14 04:37:29',NULL),(9,'niokagiadhim@gmail','Apple Crumbles','$2b$10$a5S.05kUrWF9fQd.H9x/SuCvUAhn9lJuDGlnxCpI8AMQqpMqTG1a6',NULL,'user',NULL,NULL,'2025-12-14 05:11:42','2025-12-14 05:11:42',NULL),(10,'ayam111@gmail.com','Ayam Penyet','$2b$10$TcEYu38AGUpUxhNjwQEe4.79fOeynjZdI00gsDPY3o4r8gk/e1KZW',NULL,'user','auditori','fast','2025-12-14 05:11:58','2025-12-14 07:59:23',NULL),(11,'reza@gmail.com','Ayam Penyet','$2b$10$N/r.H1yeQzaDQX6COgdXw.U3ouYM/fULstJ00NPjypCs7lPOjC6ca',NULL,'user','kinestetik','reflective','2025-12-14 05:19:39','2025-12-15 03:40:35',NULL),(12,'niokagiyyy@gmail.com','omkegams','$2b$10$LKvs4XwbuvI3SDhqlRcLCeFbOSVUMLWdwXvVEyyysvojdPhtAZv66',NULL,'user',NULL,NULL,'2025-12-14 05:35:52','2025-12-14 05:35:52',NULL),(13,'omke@gmail.com','budianjing','$2b$10$kOPo.xS4mffSklzvP0VkUePLa5JA1x9wtYciYRaBp6qugFRU1USgS',NULL,'user','kinestetik','balanced','2025-12-14 05:36:16','2025-12-14 05:42:34',NULL),(14,'omkeomke@gmail.com','okoko','$2b$10$nRbLztpxvIkZ.bT3eA25DepbB2/31sGwx86l3g6Ilv7UQvIOeTPoi',NULL,'user','kinestetik','balanced','2025-12-14 08:36:38','2025-12-14 09:45:47',NULL),(15,'Ayamnyet@gmail.com','Ayam Penyet','$2b$10$O3uPZaucSZa1ByCe.xY/u.ktV54i8sbLKIV2Aow59f5modHPANnXS',NULL,'user',NULL,NULL,'2025-12-14 09:58:17','2025-12-14 09:58:17',NULL),(16,'omkegams@gmail.com','omkegams@gmail.com','$2b$10$uDOwQHlYQpWHrLzVy98Oe.pkyPgEIm1hlVSIo3B504wBIRzU6UPRO',NULL,'user','kinestetik','balanced','2025-12-14 09:59:42','2025-12-14 10:01:30',NULL),(17,'adhimniokagi@it.student.pens.ac.id','omkegamser','$2b$10$5K7BT.HbJzEOAke7ySl7r.GNiTWzHTC.I9Ror6uG5cEtgR.glGwGe',NULL,'user','visual','balanced','2025-12-14 10:24:53','2025-12-14 10:44:08',NULL),(18,'strictnioka@gmail.com','fufufafas','$2b$10$SBOc.jAwP/A4zHohtmQpceata4Qd99hZU.sVNgolxFrj.cOl.yXU2',NULL,'user','kinestetik','balanced','2025-12-14 11:16:25','2025-12-14 15:58:47',NULL),(19,'paisadya@example.com','paisAdya','$2b$10$Huj/1diIV5LMvTwBQSFTqOY8I4ZR5JZfWgExhiMx6FFaSCvfoEiUu',NULL,'user','visual','fast','2025-12-14 11:25:27','2025-12-14 11:32:43',NULL),(20,'mfaizadya@example.com','mfaizadya','$2b$10$dX/NvBy.MLXzcIJV/SIUD.UA5x4NKWHw2iSkBL0XVvmb8BaE3Rej6',NULL,'user','visual','consistent','2025-12-14 15:57:16','2025-12-14 16:01:04',NULL),(21,'johnnn@gmail.com','Jonndueue','$2b$10$uG6XSGtsR1.exkQYwknn4etIcxHLgSU7RmUF5tPxh5id3f/YSkByK',NULL,'user','kinestetik','balanced','2025-12-14 16:02:49','2025-12-14 16:05:10',NULL),(22,'faiz123@example.com','paisss','$2b$10$PrRRNbKOPUE3sppvTjqdleghNMuJ2fGMmSpMA2mwriUQ3a2j7ctn2',NULL,'user','visual','consistent','2025-12-14 16:45:32','2025-12-18 17:11:39',NULL),(23,'johns@gmail.com','johnlennon','$2b$10$Q7t.OTNtRGOXCdH5GXI37.bnUubl4o9g5yTF4VIVBONhRV5RAoWOW',NULL,'user','auditori','reflective','2025-12-15 04:01:45','2025-12-15 06:55:02',NULL),(24,'test_user@example.com','andi_00','$2b$10$gqWRryz6MYugout1QN8hUeb7coHg9EaYgUolxrCY1K/LH8xTinflm',NULL,'user','visual','balanced','2025-12-15 05:28:01','2025-12-15 12:18:19',NULL),(25,'fufufafa@gmail.com','fufufafa','$2b$10$3m.O3zFvC60hIQ71ay6M5uRGTTcWE6A2jBvVqFYupf5Q9EuFZYAgS',NULL,'user',NULL,NULL,'2025-12-15 08:02:26','2025-12-15 08:02:26',NULL),(26,'test2@test.com','abcde_','$2b$10$xwEzv1FJm0ATyBR2E9wEs.ZsLFAcJtLeECYUz8QQJ4dKmmoYwpKEO',NULL,'user','auditori','fast','2025-12-15 12:52:05','2025-12-15 21:34:05',NULL),(27,'omkeomkeomke@gmail.com','omkeoo','$2b$10$WDf9eKai9YnZClQmsoVdz.klKPZ3NuyvmHe9GJCcAx3dbAulr2M3m',NULL,'user','kinestetik','reflective','2025-12-15 21:08:04','2025-12-15 22:08:54',NULL),(28,'yyyyy@gmail.com','yyyyy@gmail.com','$2b$10$iQHHUTGsrfBxp6oCre7mEOc1ijU4AFI6IhXx4tjGzO/W.N29LY7oi',NULL,'user',NULL,NULL,'2025-12-15 22:14:19','2025-12-15 22:14:19',NULL),(29,'omkes@gmail.com','omkegamsers','$2b$10$EDYzFcgXzu5jxnjoLtP0FOKGfgM/G.YZWLvtY3bMnt/swjnsq/v.q',NULL,'user',NULL,NULL,'2025-12-16 06:49:08','2025-12-16 06:50:23',NULL),(30,'user_abc@gmail.com','user_abc','$2b$10$/ZNzbWnrPmwSwYxSfSuNVu4mJpPjJTW//MpC7P3EA1ZKueIJ3PDkq',NULL,'user',NULL,NULL,'2025-12-17 08:43:19','2025-12-17 08:43:19',NULL),(31,'yyyy@gmail.com','yyyy','$2b$10$luQM596tLHA5S9Ut4WVZLuCa5PGh8W.X5RZiazDkrhONKT1tvbJv2',NULL,'user','auditori','balanced','2025-12-17 18:18:41','2025-12-17 18:19:32',NULL),(32,'thorfin@gmail.com','thorfin','$2b$10$3WvylLOLVoTfzkEpLTS8z.VCbuiwswKGeeACqBoN4/62Bk0PvYcu.',NULL,'user','visual','balanced','2025-12-17 19:34:33','2025-12-17 21:51:57',NULL),(33,'gunners@test.com','gunners','$2b$10$rsfXaeUDGAFJXq92Rph4Ce4LLyFRQxK6M6h5UTfP9zT5kRnZD2MRK',NULL,'user','visual','balanced','2025-12-17 21:55:29','2025-12-17 22:11:35',NULL),(34,'robber@gmail.com','robber','$2b$10$2YSrE7sVBt0ks2CfkIFtneZOLIbvWSN8TGriQkaB4GtSDMz59StM6',NULL,'user','kinestetik','balanced','2025-12-17 22:12:37','2025-12-17 22:15:02',NULL),(35,'demo@test.com','demos','$2b$10$baq7PdrS.NO0NPPcQEiAH.wlOr2PIHmGn7Ww7Hc0iY1lFBv5.zn2G',NULL,'user',NULL,NULL,'2025-12-19 08:29:28','2025-12-19 12:11:41',NULL),(36,'randy.harkediansa@gmail.com','harkediansa','$2b$10$Mu/0sz51dgI5CjEk3xzhpuBdrKT2f7aDIYD0Tpkk1J.Kw20b44qo6',NULL,'user','kinestetik','balanced','2025-12-19 09:23:07','2025-12-19 09:24:51',NULL),(37,'testrate1@gmail.com','testrate1','$2b$10$Ha4Xfwc/KHGR.QB.PwInqeP3JITeUfbTqR6yK6Naiq/eReKt1PR/O',NULL,'user',NULL,NULL,'2025-12-26 20:43:53','2025-12-26 20:43:53',NULL),(38,'rrrrrrr@gmail.com','Rrrrrrrr','$2b$10$Vy5GZ2QNVmqzv1VHA0R3muXnSpScJTC2NKzDFeYoj/MDgA5m1u8jW',NULL,'user',NULL,NULL,'2025-12-26 22:17:31','2025-12-26 22:17:31',NULL),(39,'rrrrrrttr@gmail.com','rrrrrrr@gmail.com','$2b$10$vt.1eUIptz8pswiXse7luunvzgKjPOgveYeW5qBfh494tVNdu3iqy',NULL,'user',NULL,NULL,'2025-12-26 22:17:44','2025-12-26 22:17:44',NULL),(40,'Koruko@gmail.com','mahasiswa','$2b$10$P65PS9opBW0fLOc/kEu1O.uuPfEHjei1QvwzazDvmoTXaseE8F78q',NULL,'user','auditori','reflective','2025-12-27 08:24:14','2025-12-27 08:24:58',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'capstone-db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-17 20:31:32
