-- Fix agents_login_history table structure
-- Run these SQL statements ONE AT A TIME in phpMyAdmin

-- Step 1: Check current structure
DESCRIBE `agents_login_history`;

-- Step 2: If table doesn't exist, create it:
CREATE TABLE IF NOT EXISTS `agents_login_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `agent_id` int(11) NOT NULL,
  `datetime` datetime NOT NULL,
  `ip_address` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `agent_id` (`agent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Step 3: If table exists but has issues, try this (run one at a time):
-- First, ensure id is PRIMARY KEY:
-- ALTER TABLE `agents_login_history` DROP PRIMARY KEY;
-- ALTER TABLE `agents_login_history` MODIFY `id` int(11) NOT NULL;
-- ALTER TABLE `agents_login_history` ADD PRIMARY KEY (`id`);

-- Then add AUTO_INCREMENT:
-- ALTER TABLE `agents_login_history` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- OR use the PHP script instead (easier):
-- http://127.0.0.1/snt/AGENTS%20PORTAL/fix_login_history.php

