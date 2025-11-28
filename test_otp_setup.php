<?php
/**
 * Test OTP Setup - Quick Diagnostic
 * Access: http://127.0.0.1/snt/AGENTS%20PORTAL/test_otp_setup.php
 */

require_once __DIR__ . '/../connection.php';

$results = [];
$errors = [];

try {
    // Test 1: Check database connection
    if (!isset($pdo) || $pdo === null) {
        $errors[] = "❌ Database connection failed";
    } else {
        $results[] = "✅ Database connection successful";
    }
    
    // Test 2: Check if agents table exists
    $tableCheck = "SHOW TABLES LIKE 'agents'";
    $tableExists = $pdo->query($tableCheck)->fetch();
    if ($tableExists) {
        $results[] = "✅ Agents table exists";
    } else {
        $errors[] = "❌ Agents table does not exist";
    }
    
    // Test 3: Check OTP columns
    if ($tableExists) {
        $columns = $pdo->query("SHOW COLUMNS FROM agents")->fetchAll(PDO::FETCH_COLUMN);
        
        if (in_array('otp', $columns)) {
            $results[] = "✅ 'otp' column exists";
        } else {
            $errors[] = "❌ 'otp' column MISSING";
        }
        
        if (in_array('otp_expiry', $columns)) {
            $results[] = "✅ 'otp_expiry' column exists";
        } else {
            $errors[] = "❌ 'otp_expiry' column MISSING";
        }
        
        // Show all columns for reference
        $results[] = "📋 Total columns in agents table: " . count($columns);
    }
    
    // Test 4: Try to add columns if missing
    if ($tableExists && (!in_array('otp', $columns) || !in_array('otp_expiry', $columns))) {
        $results[] = "🔧 Attempting to add missing columns...";
        
        if (!in_array('otp', $columns)) {
            try {
                $pdo->exec("ALTER TABLE `agents` ADD COLUMN `otp` VARCHAR(6) NULL DEFAULT NULL AFTER `password`");
                $results[] = "✅ Added 'otp' column";
            } catch (Exception $e) {
                $errors[] = "❌ Failed to add 'otp' column: " . $e->getMessage();
            }
        }
        
        if (!in_array('otp_expiry', $columns)) {
            try {
                $pdo->exec("ALTER TABLE `agents` ADD COLUMN `otp_expiry` DATETIME NULL DEFAULT NULL AFTER `otp`");
                $results[] = "✅ Added 'otp_expiry' column";
            } catch (Exception $e) {
                $errors[] = "❌ Failed to add 'otp_expiry' column: " . $e->getMessage();
            }
        }
    }
    
    // Test 5: Check if we can query agents
    try {
        $testQuery = "SELECT COUNT(*) as count FROM agents LIMIT 1";
        $testResult = $pdo->query($testQuery)->fetch(PDO::FETCH_ASSOC);
        $results[] = "✅ Can query agents table (found {$testResult['count']} agents)";
    } catch (Exception $e) {
        $errors[] = "❌ Cannot query agents table: " . $e->getMessage();
    }
    
} catch (Exception $e) {
    $errors[] = "❌ Fatal error: " . $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Setup Test - Agent Portal</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }
        .container {
            background: white;
            border-radius: 16px;
            padding: 32px;
            max-width: 700px;
            margin: 0 auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        h1 {
            color: #1a202c;
            margin-bottom: 24px;
            font-size: 24px;
        }
        .result {
            padding: 12px;
            margin: 8px 0;
            border-radius: 8px;
            font-family: monospace;
            font-size: 14px;
        }
        .success {
            background: #d4edda;
            color: #155724;
            border-left: 4px solid #28a745;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            border-left: 4px solid #dc3545;
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
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.5);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 OTP Setup Diagnostic Test</h1>
        
        <?php if (!empty($results)): ?>
            <h2 style="margin-top: 24px; margin-bottom: 12px; color: #28a745;">✅ Success Checks:</h2>
            <?php foreach ($results as $result): ?>
                <div class="result success"><?php echo htmlspecialchars($result); ?></div>
            <?php endforeach; ?>
        <?php endif; ?>
        
        <?php if (!empty($errors)): ?>
            <h2 style="margin-top: 24px; margin-bottom: 12px; color: #dc3545;">❌ Errors Found:</h2>
            <?php foreach ($errors as $error): ?>
                <div class="result error"><?php echo htmlspecialchars($error); ?></div>
            <?php endforeach; ?>
        <?php endif; ?>
        
        <?php if (empty($errors)): ?>
            <div class="result success" style="margin-top: 24px; font-weight: bold; font-size: 16px;">
                🎉 All checks passed! OTP system should work now.
            </div>
        <?php else: ?>
            <div class="result error" style="margin-top: 24px; font-weight: bold;">
                ⚠️ Please fix the errors above before using OTP login.
            </div>
        <?php endif; ?>
        
        <a href="check_otp_columns.php" class="btn">← Check OTP Columns</a>
        <a href="http://localhost:5175" class="btn" style="margin-left: 12px;">Go to Portal →</a>
    </div>
</body>
</html>

