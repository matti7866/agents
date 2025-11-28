-- Safe method to add OTP columns
-- Run these statements ONE AT A TIME in phpMyAdmin
-- If you get an error that column exists, that's fine - just continue to the next one

-- Step 1: Add OTP column
ALTER TABLE `agents` 
ADD COLUMN `otp` VARCHAR(6) NULL DEFAULT NULL AFTER `password`;

-- Step 2: Add OTP expiry column  
ALTER TABLE `agents` 
ADD COLUMN `otp_expiry` DATETIME NULL DEFAULT NULL AFTER `otp`;

-- Note: If you get permission errors, use the PHP script instead:
-- http://127.0.0.1/snt/AGENTS%20PORTAL/check_otp_columns.php

