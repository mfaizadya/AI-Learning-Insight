-- Migration: Ensure soft delete schema is properly applied
-- Requirements: 3.1, 3.5
-- This migration ensures all necessary columns and indexes exist for soft deletion

-- Add deleted_at column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL DEFAULT NULL;

-- Add created_at column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add updated_at column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Add index for deleted_at for performance (ignore if exists)
CREATE INDEX IF NOT EXISTS idx_deleted_at ON users (deleted_at);

-- Update existing users to have created_at and updated_at values if they are NULL
UPDATE users 
SET created_at = COALESCE(created_at, CURRENT_TIMESTAMP), 
    updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP) 
WHERE created_at IS NULL OR updated_at IS NULL;