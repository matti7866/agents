-- Agent Portal Setup SQL
-- Run this SQL in your phpMyAdmin or MySQL client to create a test agent

-- Example: Create a test agent
-- Password: 'password123' (hashed with bcrypt)
-- Make sure to replace customer_id with an actual customer ID from your database

INSERT INTO agents (
    company, 
    customer_id, 
    email, 
    password, 
    status, 
    datetime_added, 
    datetime_updated, 
    added_by, 
    deleted
) VALUES (
    'Test Agent Company',           -- Company name
    1,                               -- Change this to actual customer_id
    'agent@test.com',                -- Agent email
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',  -- Password: 'password123'
    1,                               -- Status: 1 = Active
    NOW(),                           -- datetime_added
    NOW(),                           -- datetime_updated
    1,                               -- added_by (user ID who created this)
    0                                -- deleted: 0 = Not deleted
);

-- To get customer IDs from your database:
-- SELECT customer_id, customer_name FROM customer WHERE deleted = 0 LIMIT 10;

-- To create a custom password hash in PHP:
-- <?php echo password_hash('your_password_here', PASSWORD_BCRYPT); ?>

-- Example with specific customer:
-- First, find a customer ID
-- SELECT customer_id, customer_name FROM customer WHERE deleted = 0 ORDER BY customer_id ASC LIMIT 5;

-- Then insert agent with that customer_id
-- INSERT INTO agents (company, customer_id, email, password, status, datetime_added, datetime_updated, added_by, deleted)
-- VALUES ('Agent Company Name', YOUR_CUSTOMER_ID, 'agent@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NOW(), NOW(), 1, 0);

-- Verify the agent was created:
SELECT a.*, c.customer_name 
FROM agents a
LEFT JOIN customer c ON a.customer_id = c.customer_id
WHERE a.email = 'agent@test.com';

