-- Recreate agents_login_history table (WARNING: This will DELETE all login history!)
-- Run this ONLY if you want to start fresh

-- Step 1: Drop the existing table (this deletes all data!)
DROP TABLE IF EXISTS `agents_login_history`;

-- Step 2: Create the table with correct structure
CREATE TABLE `agents_login_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `agent_id` int(11) NOT NULL,
  `datetime` datetime NOT NULL,
  `ip_address` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `agent_id` (`agent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Step 3: Verify it was created correctly
DESCRIBE `agents_login_history`;

