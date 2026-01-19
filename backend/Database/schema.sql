-- ============================================================================
-- CerdasKu AI - Unified Database Schema
-- ============================================================================
-- Version: 2.0.0
-- Last Updated: 2026-01-18
-- Description: Complete database schema for CerdasKu AI Learning Platform
--              Includes B2C (user-facing) and B2B (API Gateway) tables
-- ============================================================================

-- ============================================================================
-- DATABASE SETUP
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `capstone-db`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `capstone-db`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- SECTION 1: USER MANAGEMENT
-- ============================================================================

-- Users table: Core user accounts
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  `learning_style` ENUM('visual', 'auditori', 'kinestetik') DEFAULT NULL,
  `learning_pattern` ENUM('consistent', 'fast', 'reflective', 'balanced') DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`),
  KEY `idx_users_deleted_at` (`deleted_at`),
  KEY `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================================================
-- SECTION 2: TEST DEFINITIONS
-- ============================================================================

-- Test Pola: Learning Pattern Test definitions
DROP TABLE IF EXISTS `test_pola`;
CREATE TABLE `test_pola` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Test Gaya: Learning Style Test definitions
DROP TABLE IF EXISTS `test_gaya`;
CREATE TABLE `test_gaya` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================================================
-- SECTION 3: QUESTIONS & CHOICES
-- ============================================================================

-- Soal Pola: Learning Pattern questions
DROP TABLE IF EXISTS `soal_pola`;
CREATE TABLE `soal_pola` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `test_id` INT NOT NULL,
  `question` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_soal_pola_test` (`test_id`),
  CONSTRAINT `fk_soal_pola_test` FOREIGN KEY (`test_id`) 
    REFERENCES `test_pola` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Pilihan Pola: Learning Pattern choices with weighted scores
DROP TABLE IF EXISTS `pilihan_pola`;
CREATE TABLE `pilihan_pola` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `soal_id` INT NOT NULL,
  `option_text` TEXT NOT NULL,
  `bobot_consistent` FLOAT NOT NULL DEFAULT 0,
  `bobot_fast` FLOAT NOT NULL DEFAULT 0,
  `bobot_reflective` FLOAT NOT NULL DEFAULT 0,
  `bobot_balanced` FLOAT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_pilihan_pola_soal` (`soal_id`),
  CONSTRAINT `fk_pilihan_pola_soal` FOREIGN KEY (`soal_id`) 
    REFERENCES `soal_pola` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Soal Gaya: Learning Style questions
DROP TABLE IF EXISTS `soal_gaya`;
CREATE TABLE `soal_gaya` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `test_id` INT NOT NULL,
  `question` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_soal_gaya_test` (`test_id`),
  CONSTRAINT `fk_soal_gaya_test` FOREIGN KEY (`test_id`) 
    REFERENCES `test_gaya` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Pilihan Gaya: Learning Style choices with weighted scores
DROP TABLE IF EXISTS `pilihan_gaya`;
CREATE TABLE `pilihan_gaya` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `soal_id` INT NOT NULL,
  `option_text` TEXT NOT NULL,
  `bobot_visual` INT NOT NULL DEFAULT 0,
  `bobot_auditori` INT NOT NULL DEFAULT 0,
  `bobot_kinestetik` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_pilihan_gaya_soal` (`soal_id`),
  CONSTRAINT `fk_pilihan_gaya_soal` FOREIGN KEY (`soal_id`) 
    REFERENCES `soal_gaya` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================================================
-- SECTION 4: TEST RESULTS
-- ============================================================================

-- Hasil Test: Aggregated test results per user
DROP TABLE IF EXISTS `hasil_test`;
CREATE TABLE `hasil_test` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `test_pola_id` INT DEFAULT NULL,
  `test_gaya_id` INT DEFAULT NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `label_pola` VARCHAR(50) DEFAULT NULL COMMENT 'e.g.: Consistent Learner, Fast Learner',
  `label_gaya` VARCHAR(50) DEFAULT NULL COMMENT 'e.g.: Visual, Auditori, Kinestetik',
  `persentase_gaya` INT DEFAULT NULL COMMENT 'Percentage score for learning style',
  PRIMARY KEY (`id`),
  KEY `idx_hasil_user` (`user_id`),
  KEY `idx_hasil_test_pola` (`test_pola_id`),
  KEY `idx_hasil_test_gaya` (`test_gaya_id`),
  KEY `idx_hasil_timestamp` (`timestamp`),
  CONSTRAINT `fk_hasil_user` FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_hasil_test_pola` FOREIGN KEY (`test_pola_id`) 
    REFERENCES `test_pola` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_hasil_test_gaya` FOREIGN KEY (`test_gaya_id`) 
    REFERENCES `test_gaya` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Hasil Test Pola Detail: Individual answers for pattern test
DROP TABLE IF EXISTS `hasil_test_pola_detail`;
CREATE TABLE `hasil_test_pola_detail` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `hasil_test_id` INT NOT NULL,
  `soal_id` INT NOT NULL,
  `pilihan_id` INT NOT NULL,
  `bobot_consistent` FLOAT NOT NULL DEFAULT 0,
  `bobot_fast` FLOAT NOT NULL DEFAULT 0,
  `bobot_reflective` FLOAT NOT NULL DEFAULT 0,
  `bobot_balanced` FLOAT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_detail_pola_hasil` (`hasil_test_id`),
  KEY `idx_detail_pola_soal` (`soal_id`),
  KEY `idx_detail_pola_pilihan` (`pilihan_id`),
  CONSTRAINT `fk_detail_pola_hasil` FOREIGN KEY (`hasil_test_id`) 
    REFERENCES `hasil_test` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_detail_pola_soal` FOREIGN KEY (`soal_id`) 
    REFERENCES `soal_pola` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_detail_pola_pilihan` FOREIGN KEY (`pilihan_id`) 
    REFERENCES `pilihan_pola` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Hasil Test Gaya Detail: Individual answers for style test
DROP TABLE IF EXISTS `hasil_test_gaya_detail`;
CREATE TABLE `hasil_test_gaya_detail` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `hasil_test_id` INT NOT NULL,
  `soal_id` INT NOT NULL,
  `pilihan_id` INT NOT NULL,
  `bobot_visual` INT NOT NULL DEFAULT 0,
  `bobot_auditori` INT NOT NULL DEFAULT 0,
  `bobot_kinestetik` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_detail_gaya_hasil` (`hasil_test_id`),
  KEY `idx_detail_gaya_soal` (`soal_id`),
  KEY `idx_detail_gaya_pilihan` (`pilihan_id`),
  CONSTRAINT `fk_detail_gaya_hasil` FOREIGN KEY (`hasil_test_id`) 
    REFERENCES `hasil_test` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_detail_gaya_soal` FOREIGN KEY (`soal_id`) 
    REFERENCES `soal_gaya` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_detail_gaya_pilihan` FOREIGN KEY (`pilihan_id`) 
    REFERENCES `pilihan_gaya` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================================================
-- SECTION 5: AI INSIGHTS & MESSAGES
-- ============================================================================

-- Insight: AI-generated personalized learning recommendations
DROP TABLE IF EXISTS `insight`;
CREATE TABLE `insight` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `insight` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_insight_user` (`user_id`),
  KEY `idx_insight_created` (`created_at`),
  CONSTRAINT `fk_insight_user` FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- MOTD: Message of the Day for platform announcements
DROP TABLE IF EXISTS `motd`;
CREATE TABLE `motd` (
  `motd_id` INT NOT NULL AUTO_INCREMENT,
  `message` TEXT NOT NULL,
  PRIMARY KEY (`motd_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================================================
-- SECTION 6: B2B API GATEWAY
-- ============================================================================

-- Tenants: B2B client organizations (LMS, Schools, etc.)
DROP TABLE IF EXISTS `tenants`;
CREATE TABLE `tenants` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL COMMENT 'Organization display name',
  `slug` VARCHAR(100) NOT NULL COMMENT 'URL-safe identifier',
  `tier` ENUM('sandbox', 'basic', 'premium', 'enterprise') NOT NULL DEFAULT 'sandbox',
  `contact_email` VARCHAR(255) DEFAULT NULL,
  `webhook_url` VARCHAR(500) DEFAULT NULL COMMENT 'Optional callback URL',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenants_slug` (`slug`),
  KEY `idx_tenants_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- API Keys: Authentication keys for B2B API access
DROP TABLE IF EXISTS `api_keys`;
CREATE TABLE `api_keys` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tenant_id` INT NOT NULL,
  `key_hash` VARCHAR(64) NOT NULL COMMENT 'SHA256 hash of the API key',
  `key_prefix` VARCHAR(20) NOT NULL COMMENT 'First chars for identification (ck_sandbox_, ck_live_)',
  `name` VARCHAR(100) DEFAULT NULL COMMENT 'Friendly name for the key',
  `scopes` JSON DEFAULT NULL COMMENT 'Allowed scopes: ["predict", "usage:read", "*"]',
  `rate_limit` INT DEFAULT 100 COMMENT 'Requests per minute',
  `expires_at` TIMESTAMP NULL DEFAULT NULL,
  `last_used_at` TIMESTAMP NULL DEFAULT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_api_keys_hash` (`key_hash`),
  KEY `idx_api_keys_tenant` (`tenant_id`),
  KEY `idx_api_keys_prefix` (`key_prefix`),
  KEY `idx_api_keys_active` (`is_active`),
  CONSTRAINT `fk_api_keys_tenant` FOREIGN KEY (`tenant_id`) 
    REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Usage Logs: API usage tracking for billing and analytics
DROP TABLE IF EXISTS `usage_logs`;
CREATE TABLE `usage_logs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `tenant_id` INT NOT NULL,
  `api_key_id` INT DEFAULT NULL,
  `endpoint` VARCHAR(100) NOT NULL,
  `method` VARCHAR(10) NOT NULL DEFAULT 'GET',
  `status_code` INT NOT NULL,
  `response_time_ms` INT DEFAULT NULL,
  `request_ip` VARCHAR(45) DEFAULT NULL COMMENT 'Supports IPv6',
  `tokens_used` INT DEFAULT 0 COMMENT 'Billing units consumed',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_usage_tenant` (`tenant_id`),
  KEY `idx_usage_api_key` (`api_key_id`),
  KEY `idx_usage_created` (`created_at`),
  KEY `idx_usage_endpoint` (`endpoint`),
  CONSTRAINT `fk_usage_tenant` FOREIGN KEY (`tenant_id`) 
    REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_usage_api_key` FOREIGN KEY (`api_key_id`) 
    REFERENCES `api_keys` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================================================
-- RE-ENABLE FOREIGN KEY CHECKS
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
