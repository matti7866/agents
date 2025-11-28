-- Add reset token columns to agents table for password reset functionality
-- Run these SQL statements ONE AT A TIME in phpMyAdmin

-- Step 1: Add reset_token column
ALTER TABLE `agents` 
ADD COLUMN `reset_token` VARCHAR(64) NULL DEFAULT NULL AFTER `password`;

-- Step 2: Add reset_token_expiry column
ALTER TABLE `agents` 
ADD COLUMN `reset_token_expiry` DATETIME NULL DEFAULT NULL AFTER `reset_token`;

-- Note: If you get errors that columns exist, that's fine - just continue
-- Or use the PHP script: http://127.0.0.1/snt/AGENTS%20PORTAL/check_reset_columns.php

