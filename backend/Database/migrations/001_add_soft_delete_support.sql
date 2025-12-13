-- Migration: Add soft delete support to users table
-- Requirements: 3.1, 3.5

-- Add deleted_at column for soft deletion
ALTER TABLE users 
ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL,
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Add index for deleted_at for performance
ALTER TABLE users 
ADD INDEX idx_deleted_at (deleted_at);

-- Update existing users to have created_at and updated_at values
UPDATE users 
SET created_at = CURRENT_TIMESTAMP, 
    updated_at = CURRENT_TIMESTAMP 
WHERE created_at IS NULL OR updated_at IS NULL;