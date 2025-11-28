<?php
/**
 * Check and Add Reset Token Columns to Agents Table
 * Access: http://127.0.0.1/snt/AGENTS%20PORTAL/check_reset_columns.php
 */

require_once __DIR__ . '/../connection.php';

$message = '';
$error = '';

try {
    // Get all columns
    $allColumns = $pdo->query("SHOW COLUMNS FROM agents")->fetchAll(PDO::FETCH_ASSOC);
    
    $resetTokenExists = false;
    $resetTokenExpiryExists = false;
    
    foreach ($allColumns as $col) {
        if ($col['Field'] === 'reset_token') {
            $resetTokenExists = true;
        }
        if ($col['Field'] === 'reset_token_expiry') {
            $resetTokenExpiryExists = true;
        }
    }
    
    // Add columns if they don't exist
    if (!$resetTokenExists || !$resetTokenExpiryExists) {
        if (!$resetTokenExists) {
            try {
                $pdo->exec("ALTER TABLE `agents` ADD COLUMN `reset_token` VARCHAR(64) NULL DEFAULT NULL AFTER `password`");
                $message .= "✓ Added 'reset_token' column.<br>";
            } catch (PDOException $e) {
                if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
                    $message .= "ℹ 'reset_token' column already exists.<br>";
                    $resetTokenExists = true;
                } else {
                    throw $e;
                }
            }
        }
        
        if (!$resetTokenExpiryExists) {
            try {
                $pdo->exec("ALTER TABLE `agents` ADD COLUMN `reset_token_expiry` DATETIME NULL DEFAULT NULL AFTER `reset_token`");
                $message .= "✓ Added 'reset_token_expiry' column.<br>";
            } catch (PDOException $e) {
                if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
                    $message .= "ℹ 'reset_token_expiry' column already exists.<br>";
                    $resetTokenExpiryExists = true;
                } else {
                    throw $e;
                }
            }
        }
        
        if ($resetTokenExists && $resetTokenExpiryExists) {
            $message = "<strong>✓ All reset token columns are ready!</strong>";
        } else {
            $message = "<strong>✓ Reset token columns setup completed!</strong>";
        }
    } else {
        $message = "✓ Reset token columns already exist. No changes needed.";
    }
    
    // Get columns for display
    $columns = [];
    foreach ($allColumns as $col) {
        if ($col['Field'] === 'reset_token' || $col['Field'] === 'reset_token_expiry') {
            $columns[] = $col;
        }
    }
    
} catch (Exception $e) {
    $error = 'Error: ' . $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Check Reset Token Columns - Agent Portal</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
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
        <h1>🔧 Reset Token Columns Setup</h1>
        
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
        
        <a href="check_otp_columns.php" class="btn">← Check OTP Columns</a>
        <a href="http://localhost:5175" class="btn" style="margin-left: 12px;">Go to Portal →</a>
    </div>
</body>
</html>

