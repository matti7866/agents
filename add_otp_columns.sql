-- Add OTP columns to agents table
-- Run this SQL in phpMyAdmin or MySQL client
-- This script will add the columns only if they don't exist

-- Step 1: Check if columns exist and add them if they don't
-- For MySQL, we need to use a different approach

-- First, try to add the columns (will fail if they exist, but that's okay)
-- You can run these one at a time:

-- Add OTP column
ALTER TABLE `agents` 
ADD COLUMN `otp` VARCHAR(6) NULL DEFAULT NULL AFTER `password`;

-- If the above gives an error that column exists, skip it and run this:
ALTER TABLE `agents` 
ADD COLUMN `otp_expiry` DATETIME NULL DEFAULT NULL AFTER `otp`;

-- Alternative: Run this single command (will error if columns exist, but that's fine):
-- ALTER TABLE `agents` 
-- ADD COLUMN `otp` VARCHAR(6) NULL DEFAULT NULL AFTER `password`,
-- ADD COLUMN `otp_expiry` DATETIME NULL DEFAULT NULL AFTER `otp`;

-- Verify columns were added
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'agents' 
AND COLUMN_NAME IN ('otp', 'otp_expiry');

