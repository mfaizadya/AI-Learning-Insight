-- =============================================
-- B2B Multi-tenant Schema Extension
-- CerdasKu AI - Option A MVP
-- Version: 1.0.0
-- Date: 2026-01-18
-- =============================================

-- Ensure we're using the correct database
-- USE `capstone-db`;

-- =============================================
-- Table: tenants
-- Organisasi/institusi yang mengintegrasikan API
-- =============================================
CREATE TABLE IF NOT EXISTS `tenants` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL COMMENT 'Nama organisasi/institusi',
    `slug` VARCHAR(100) NOT NULL COMMENT 'Unique identifier slug',
    `tier` ENUM('sandbox', 'personal_pro', 'institutional', 'enterprise') NOT NULL DEFAULT 'sandbox' COMMENT 'Pricing tier',
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Status aktif tenant',
    `contact_email` VARCHAR(255) NULL COMMENT 'Email kontak PIC',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_tenants_slug` (`slug`),
    INDEX `idx_tenants_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =============================================
-- Table: api_keys
-- Kredensial API unik per tenant
-- =============================================
CREATE TABLE IF NOT EXISTS `api_keys` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `tenant_id` INT NOT NULL COMMENT 'Foreign key ke tenants',
    `key_hash` VARCHAR(64) NOT NULL COMMENT 'SHA256 hash dari API key',
    `key_prefix` VARCHAR(12) NOT NULL COMMENT 'Prefix untuk identifikasi (ck_sandbox_, ck_live_)',
    `name` VARCHAR(100) NULL COMMENT 'Nama deskriptif untuk key ini',
    `scopes` JSON NOT NULL DEFAULT ('["predict"]') COMMENT 'Array of allowed scopes',
    `rate_limit` INT NOT NULL DEFAULT 100 COMMENT 'Max requests per minute',
    `expires_at` TIMESTAMP NULL COMMENT 'Waktu kedaluwarsa (NULL = tidak expire)',
    `last_used_at` TIMESTAMP NULL COMMENT 'Waktu terakhir digunakan',
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Status aktif key',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_api_keys_hash` (`key_hash`),
    INDEX `idx_api_keys_tenant` (`tenant_id`),
    INDEX `idx_api_keys_active` (`is_active`),
    CONSTRAINT `fk_api_keys_tenant` 
        FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =============================================
-- Table: usage_logs
-- Audit trail konsumsi API per tenant
-- =============================================
CREATE TABLE IF NOT EXISTS `usage_logs` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenant_id` INT NOT NULL COMMENT 'Foreign key ke tenants',
    `api_key_id` INT NULL COMMENT 'Foreign key ke api_keys',
    `endpoint` VARCHAR(100) NOT NULL COMMENT 'API endpoint yang dipanggil',
    `method` VARCHAR(10) NOT NULL COMMENT 'HTTP method (GET, POST, etc)',
    `tokens_used` INT NOT NULL DEFAULT 0 COMMENT 'Token/unit yang digunakan',
    `response_time_ms` INT NULL COMMENT 'Response time dalam milliseconds',
    `status_code` INT NULL COMMENT 'HTTP status code response',
    `request_ip` VARCHAR(45) NULL COMMENT 'IP address requester (IPv4/IPv6)',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_usage_logs_tenant_date` (`tenant_id`, `created_at`),
    INDEX `idx_usage_logs_api_key` (`api_key_id`),
    INDEX `idx_usage_logs_created` (`created_at`),
    CONSTRAINT `fk_usage_logs_tenant` 
        FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_usage_logs_api_key` 
        FOREIGN KEY (`api_key_id`) REFERENCES `api_keys` (`id`) 
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =============================================
-- Seed Data: Default sandbox tenant untuk testing
-- =============================================
INSERT INTO `tenants` (`name`, `slug`, `tier`, `contact_email`) 
VALUES ('Sandbox Development', 'sandbox-dev', 'sandbox', 'dev@cerdasku.ai')
ON DUPLICATE KEY UPDATE `name` = `name`;

-- Note: API Key harus di-generate via utility script
-- Jangan hardcode API key di migration file

-- =============================================
-- End of Migration
-- =============================================
