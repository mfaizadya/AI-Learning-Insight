-- ============================================================================
-- Migration: Add API Access Requests Table
-- Description: Table to store B2B API access requests from partners
-- Created: 2025-01-18
-- ============================================================================

-- API Access Requests: Store pending/approved/rejected API access requests
CREATE TABLE IF NOT EXISTS `api_access_requests` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT 'FK to users table - the requester',
  `organization_name` VARCHAR(255) NOT NULL COMMENT 'Company/Organization name',
  `contact_email` VARCHAR(255) NOT NULL COMMENT 'Contact email for communication',
  `use_case` ENUM('lms_integration', 'research', 'EdTech', 'corporate_training', 'other') NOT NULL,
  `expected_requests` ENUM('1000', '10000', '50000', '100000') NOT NULL COMMENT 'Monthly request volume tier',
  `description` TEXT DEFAULT NULL COMMENT 'Optional description of use case',
  `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  `reviewed_by` INT DEFAULT NULL COMMENT 'Admin who reviewed the request',
  `reviewed_at` TIMESTAMP NULL DEFAULT NULL,
  `rejection_reason` TEXT DEFAULT NULL COMMENT 'Reason if rejected',
  `tenant_id` INT DEFAULT NULL COMMENT 'Created tenant ID after approval',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_api_requests_user` (`user_id`),
  KEY `idx_api_requests_status` (`status`),
  KEY `idx_api_requests_created` (`created_at`),
  CONSTRAINT `fk_api_requests_user` FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_api_requests_tenant` FOREIGN KEY (`tenant_id`) 
    REFERENCES `tenants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Add index for faster lookups by email
CREATE INDEX `idx_api_requests_email` ON `api_access_requests` (`contact_email`);
