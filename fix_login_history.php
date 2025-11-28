<?php
/**
 * Fix agents_login_history table structure
 * Access: http://127.0.0.1/snt/AGENTS%20PORTAL/fix_login_history.php
 */

require_once __DIR__ . '/../connection.php';

$message = '';
$error = '';

try {
    // Check if table exists
    $checkTable = "SHOW TABLES LIKE 'agents_login_history'";
    $tableExists = $pdo->query($checkTable)->fetch();
    
    if (!$tableExists) {
        // Create the table
        $createTable = "CREATE TABLE `agents_login_history` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `agent_id` int(11) NOT NULL,
            `datetime` datetime NOT NULL,
            `ip_address` varchar(100) DEFAULT NULL,
            `country` varchar(100) DEFAULT NULL,
            PRIMARY KEY (`id`),
            KEY `agent_id` (`agent_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
        
        $pdo->exec($createTable);
        $message = "✓ Created agents_login_history table successfully!";
    } else {
        // Get all columns to check structure
        $allColumns = $pdo->query("SHOW COLUMNS FROM agents_login_history")->fetchAll(PDO::FETCH_ASSOC);
        
        $idColumn = null;
        $hasAutoIncrement = false;
        $hasPrimaryKey = false;
        
        foreach ($allColumns as $col) {
            if ($col['Field'] === 'id') {
                $idColumn = $col;
                if (strpos($col['Extra'], 'auto_increment') !== false) {
                    $hasAutoIncrement = true;
                }
                if ($col['Key'] === 'PRI') {
                    $hasPrimaryKey = true;
                }
            }
        }
        
        if (!$idColumn) {
            // No id column - add it
            $pdo->exec("ALTER TABLE `agents_login_history` ADD COLUMN `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST");
            $message = "✓ Added id column with AUTO_INCREMENT and PRIMARY KEY!";
        } elseif (!$hasAutoIncrement || !$hasPrimaryKey) {
            // Check if there's another AUTO_INCREMENT column
            $otherAutoIncrement = false;
            foreach ($allColumns as $col) {
                if ($col['Field'] !== 'id' && strpos($col['Extra'], 'auto_increment') !== false) {
                    $otherAutoIncrement = true;
                    break;
                }
            }
            
            if ($otherAutoIncrement) {
                $message = "⚠ Table has another AUTO_INCREMENT column. Cannot modify id. Table structure may need manual review.";
            } else {
                // Fix the id column - ensure it's PRIMARY KEY first, then AUTO_INCREMENT
                if (!$hasPrimaryKey) {
                    // First make it PRIMARY KEY
                    try {
                        $pdo->exec("ALTER TABLE `agents_login_history` MODIFY `id` int(11) NOT NULL");
                        $pdo->exec("ALTER TABLE `agents_login_history` ADD PRIMARY KEY (`id`)");
                    } catch (Exception $e) {
                        // Primary key might already exist, continue
                    }
                }
                
                // Then add AUTO_INCREMENT
                try {
                    $pdo->exec("ALTER TABLE `agents_login_history` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT");
                    $message = "✓ Fixed id column to AUTO_INCREMENT!";
                } catch (Exception $e) {
                    $message = "⚠ Could not modify id column: " . $e->getMessage() . "<br>Table may already be correct or need manual fix.";
                }
            }
        } else {
            $message = "✓ Table structure is correct. No changes needed.";
        }
    }
    
    // Verify structure
    $columns = $pdo->query("SHOW COLUMNS FROM agents_login_history")->fetchAll(PDO::FETCH_ASSOC);
    
    // Check for any issues
    $autoIncrementColumns = [];
    $primaryKeyColumns = [];
    foreach ($columns as $col) {
        if (strpos($col['Extra'], 'auto_increment') !== false) {
            $autoIncrementColumns[] = $col['Field'];
        }
        if ($col['Key'] === 'PRI') {
            $primaryKeyColumns[] = $col['Field'];
        }
    }
    
    if (count($autoIncrementColumns) > 1) {
        $message .= "<br><br>⚠️ Warning: Found multiple AUTO_INCREMENT columns: " . implode(', ', $autoIncrementColumns);
        $message .= "<br>MySQL only allows one AUTO_INCREMENT column per table.";
    }
    
} catch (Exception $e) {
    $error = 'Error: ' . $e->getMessage();
    $error .= '<br><br><strong>Manual Fix:</strong><br>';
    $error .= '1. Check table structure: DESCRIBE agents_login_history;<br>';
    $error .= '2. If id exists but is not AUTO_INCREMENT, you may need to:<br>';
    $error .= '   - Drop and recreate the table, OR<br>';
    $error .= '   - Remove any other AUTO_INCREMENT columns first';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fix Login History Table - Agent Portal</title>
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
        <h1>🔧 Fix Login History Table</h1>
        
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
            <h2 style="margin-top: 24px; margin-bottom: 12px; font-size: 18px;">Table Structure:</h2>
            <table>
                <thead>
                    <tr>
                        <th>Column</th>
                        <th>Type</th>
                        <th>Null</th>
                        <th>Key</th>
                        <th>Extra</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($columns as $col): ?>
                        <tr>
                            <td><strong><?php echo htmlspecialchars($col['Field']); ?></strong></td>
                            <td><?php echo htmlspecialchars($col['Type']); ?></td>
                            <td><?php echo htmlspecialchars($col['Null']); ?></td>
                            <td><?php echo htmlspecialchars($col['Key']); ?></td>
                            <td><?php echo htmlspecialchars($col['Extra']); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
        
        <?php if (isset($autoIncrementColumns) && count($autoIncrementColumns) > 1): ?>
            <div class="message error" style="margin-top: 24px;">
                <strong>⚠️ Multiple AUTO_INCREMENT Columns Detected!</strong><br><br>
                The table has multiple AUTO_INCREMENT columns which is not allowed in MySQL.<br><br>
                <strong>Solution:</strong> You can recreate the table (this will delete login history data):<br>
                <code style="background: #f7fafc; padding: 8px; border-radius: 4px; display: block; margin-top: 8px;">
                    DROP TABLE IF EXISTS `agents_login_history`;<br>
                    CREATE TABLE `agents_login_history` (<br>
                    &nbsp;&nbsp;`id` int(11) NOT NULL AUTO_INCREMENT,<br>
                    &nbsp;&nbsp;`agent_id` int(11) NOT NULL,<br>
                    &nbsp;&nbsp;`datetime` datetime NOT NULL,<br>
                    &nbsp;&nbsp;`ip_address` varchar(100) DEFAULT NULL,<br>
                    &nbsp;&nbsp;`country` varchar(100) DEFAULT NULL,<br>
                    &nbsp;&nbsp;PRIMARY KEY (`id`),<br>
                    &nbsp;&nbsp;KEY `agent_id` (`agent_id`)<br>
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                </code>
                <br>
                <small>Or see recreate_login_history.sql file for the full SQL.</small>
            </div>
        <?php endif; ?>
        
        <a href="check_otp_columns.php" class="btn">← Check OTP Columns</a>
        <a href="http://localhost:5175" class="btn" style="margin-left: 12px;">Go to Portal →</a>
    </div>
</body>
</html>

