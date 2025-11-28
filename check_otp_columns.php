<?php
/**
 * Check and Add OTP Columns to Agents Table
 * Access: http://127.0.0.1/snt/AGENTS%20PORTAL/check_otp_columns.php
 */

require_once __DIR__ . '/../connection.php';

$message = '';
$error = '';

try {
    // Check if columns exist by trying to describe the table
    $checkSql = "SHOW COLUMNS FROM agents";
    $allColumns = $pdo->query($checkSql)->fetchAll(PDO::FETCH_ASSOC);
    
    $otpExists = false;
    $otpExpiryExists = false;
    
    foreach ($allColumns as $col) {
        if ($col['Field'] === 'otp') {
            $otpExists = true;
        }
        if ($col['Field'] === 'otp_expiry') {
            $otpExpiryExists = true;
        }
    }
    
    // Add columns if they don't exist
    if (!$otpExists || !$otpExpiryExists) {
        if (!$otpExists) {
            try {
                $pdo->exec("ALTER TABLE `agents` ADD COLUMN `otp` VARCHAR(6) NULL DEFAULT NULL AFTER `password`");
                $message .= "✓ Added 'otp' column.<br>";
            } catch (PDOException $e) {
                if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
                    $message .= "ℹ 'otp' column already exists.<br>";
                    $otpExists = true;
                } else {
                    throw $e;
                }
            }
        }
        
        if (!$otpExpiryExists) {
            try {
                $pdo->exec("ALTER TABLE `agents` ADD COLUMN `otp_expiry` DATETIME NULL DEFAULT NULL AFTER `otp`");
                $message .= "✓ Added 'otp_expiry' column.<br>";
            } catch (PDOException $e) {
                if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
                    $message .= "ℹ 'otp_expiry' column already exists.<br>";
                    $otpExpiryExists = true;
                } else {
                    throw $e;
                }
            }
        }
        
        if ($otpExists && $otpExpiryExists) {
            $message = "<strong>✓ All OTP columns are ready!</strong>";
        } else {
            $message = "<strong>✓ OTP columns setup completed!</strong>";
        }
    } else {
        $message = "✓ OTP columns already exist. No changes needed.";
    }
    
    // Verify columns
    $columns = [];
    foreach ($allColumns as $col) {
        if ($col['Field'] === 'otp' || $col['Field'] === 'otp_expiry') {
            $columns[] = $col;
        }
    }
    
} catch (Exception $e) {
    $error = 'Error: ' . $e->getMessage();
    $error .= '<br><br><strong>Try running the SQL manually:</strong><br>';
    $error .= 'Run these one at a time in phpMyAdmin:<br>';
    $error .= '1. ALTER TABLE `agents` ADD COLUMN `otp` VARCHAR(6) NULL DEFAULT NULL AFTER `password`;<br>';
    $error .= '2. ALTER TABLE `agents` ADD COLUMN `otp_expiry` DATETIME NULL DEFAULT NULL AFTER `otp`;';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Check OTP Columns - Agent Portal</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Inter', -apple-system, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            border-radius: 16px;
            padding: 32px;
            max-width: 600px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        h1 {
            color: #1a202c;
            margin-bottom: 24px;
            font-size: 24px;
        }
        .message {
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
        }
        .message.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .message.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        th {
            background: #f7fafc;
            font-weight: 600;
            color: #2d3748;
        }
        .btn {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.5);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔧 OTP Columns Setup</h1>
        
        <?php if ($message): ?>
            <div class="message success">
                <?php echo $message; ?>
            </div>
        <?php endif; ?>
        
        <?php if ($error): ?>
            <div class="message error">
                <?php echo $error; ?>
            </div>
        <?php endif; ?>
        
        <?php if (isset($columns) && !empty($columns)): ?>
            <h2 style="margin-top: 24px; margin-bottom: 12px; font-size: 18px;">Current Columns:</h2>
            <table>
                <thead>
                    <tr>
                        <th>Column Name</th>
                        <th>Type</th>
                        <th>Null</th>
                        <th>Default</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($columns as $col): ?>
                        <tr>
                            <td><strong><?php echo htmlspecialchars($col['Field']); ?></strong></td>
                            <td><?php echo htmlspecialchars($col['Type']); ?></td>
                            <td><?php echo htmlspecialchars($col['Null']); ?></td>
                            <td><?php echo htmlspecialchars($col['Default'] ?? 'NULL'); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
        
        <a href="create_agent.php" class="btn">← Back to Create Agent</a>
        <a href="http://localhost:5175" class="btn" style="margin-left: 12px;">Go to Portal →</a>
    </div>
</body>
</html>

