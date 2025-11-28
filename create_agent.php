<?php
/**
 * Agent Creation Helper Script
 * Access: http://127.0.0.1/snt/AGENTS%20PORTAL/create_agent.php
 */

require_once __DIR__ . '/../connection.php';

// Set to true to enable this script (for security, disable after creating agents)
$ENABLE_SCRIPT = true;

if (!$ENABLE_SCRIPT) {
    die('Script is disabled. Set $ENABLE_SCRIPT = true in the file to enable it.');
}

$message = '';
$error = '';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $company = trim($_POST['company'] ?? '');
    $customer_id = intval($_POST['customer_id'] ?? 0);
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    
    if (empty($company) || empty($customer_id) || empty($email) || empty($password)) {
        $error = 'All fields are required';
    } else {
        try {
            // Check if email already exists
            $checkSql = "SELECT id FROM agents WHERE email = :email";
            $checkStmt = $pdo->prepare($checkSql);
            $checkStmt->bindParam(':email', $email);
            $checkStmt->execute();
            
            if ($checkStmt->fetch()) {
                $error = 'An agent with this email already exists';
            } else {
                // Hash the password (optional - login uses OTP now)
                $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
                
                // Insert the agent
                $sql = "INSERT INTO agents (company, customer_id, email, password, status, datetime_added, datetime_updated, added_by, deleted)
                        VALUES (:company, :customer_id, :email, :password, 1, NOW(), NOW(), 1, 0)";
                
                $stmt = $pdo->prepare($sql);
                $stmt->bindParam(':company', $company);
                $stmt->bindParam(':customer_id', $customer_id);
                $stmt->bindParam(':email', $email);
                $stmt->bindParam(':password', $hashedPassword);
                $stmt->execute();
                
                $message = "Agent created successfully! Login uses OTP - agent will receive OTP via email when logging in.";
            }
        } catch (Exception $e) {
            $error = 'Error creating agent: ' . $e->getMessage();
        }
    }
}

// Get list of customers for dropdown
$customerSql = "SELECT customer_id, customer_name FROM customer WHERE deleted = 0 ORDER BY customer_name ASC LIMIT 100";
$customers = $pdo->query($customerSql)->fetchAll(PDO::FETCH_ASSOC);

// Get existing agents
$agentsSql = "SELECT a.*, c.customer_name 
              FROM agents a
              LEFT JOIN customer c ON a.customer_id = c.customer_id
              WHERE a.deleted = 0
              ORDER BY a.datetime_added DESC";
$agents = $pdo->query($agentsSql)->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Agent - Agent Portal Setup</title>
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
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
        }
        .card {
            background: white;
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            margin-bottom: 24px;
        }
        h1 {
            color: #1a202c;
            margin-bottom: 8px;
            font-size: 28px;
        }
        .subtitle {
            color: #718096;
            margin-bottom: 32px;
        }
        .alert {
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
        }
        .alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .alert-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 8px;
            font-size: 14px;
        }
        input, select {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            font-size: 15px;
            transition: all 0.3s ease;
        }
        input:focus, select:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 14px 24px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            transition: all 0.3s ease;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.5);
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
            font-size: 13px;
            text-transform: uppercase;
        }
        td {
            color: #4a5568;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
        .badge-active {
            background: #d4edda;
            color: #155724;
        }
        .badge-inactive {
            background: #f8d7da;
            color: #721c24;
        }
        .portal-link {
            display: inline-block;
            margin-top: 16px;
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
        }
        .portal-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1>🔐 Create Agent Account</h1>
            <p class="subtitle">Create agent accounts to access the portal</p>
            
            <?php if ($message): ?>
                <div class="alert alert-success"><?php echo htmlspecialchars($message); ?></div>
            <?php endif; ?>
            
            <?php if ($error): ?>
                <div class="alert alert-error"><?php echo htmlspecialchars($error); ?></div>
            <?php endif; ?>
            
            <form method="POST">
                <div class="form-group">
                    <label for="company">Company Name</label>
                    <input type="text" id="company" name="company" required placeholder="Enter company name">
                </div>
                
                <div class="form-group">
                    <label for="customer_id">Select Customer</label>
                    <select id="customer_id" name="customer_id" required>
                        <option value="">-- Select a customer --</option>
                        <?php foreach ($customers as $customer): ?>
                            <option value="<?php echo $customer['customer_id']; ?>">
                                <?php echo htmlspecialchars($customer['customer_name']); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" required placeholder="agent@example.com">
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required placeholder="Enter password">
                </div>
                
                <button type="submit">Create Agent</button>
            </form>
            
            <a href="http://localhost:5175" class="portal-link" target="_blank">
                🚀 Open Agent Portal →
            </a>
        </div>
        
        <div class="card">
            <h2 style="margin-bottom: 16px;">Existing Agents</h2>
            
            <?php if (empty($agents)): ?>
                <p style="color: #718096; text-align: center; padding: 20px;">No agents created yet</p>
            <?php else: ?>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Company</th>
                            <th>Email</th>
                            <th>Customer</th>
                            <th>Status</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($agents as $agent): ?>
                            <tr>
                                <td><?php echo $agent['id']; ?></td>
                                <td><?php echo htmlspecialchars($agent['company']); ?></td>
                                <td><?php echo htmlspecialchars($agent['email']); ?></td>
                                <td><?php echo htmlspecialchars($agent['customer_name'] ?? 'N/A'); ?></td>
                                <td>
                                    <?php if ($agent['status'] == 1): ?>
                                        <span class="badge badge-active">Active</span>
                                    <?php else: ?>
                                        <span class="badge badge-inactive">Inactive</span>
                                    <?php endif; ?>
                                </td>
                                <td><?php echo date('M d, Y', strtotime($agent['datetime_added'])); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>

