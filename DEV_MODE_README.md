# 🔧 Development Mode - OTP Bypass

## Current Status: **DEV MODE ENABLED** ✅

The OTP system is currently in **bypass mode** for development purposes.

### What This Means:
- ✅ You can login with **any 6-digit code** (e.g., `123456`, `000000`, etc.)
- ✅ No email will be sent
- ✅ No OTP columns needed in database
- ✅ Faster testing and development

### How to Use:
1. Enter your agent email
2. Click "Send OTP Code"
3. Enter **any 6 digits** (e.g., `123456`)
4. Click "Verify & Login"
5. You're in! 🎉

### Files with DEV_BYPASS_OTP:
- `/api/agent/send-otp.php` - Line 7
- `/api/agent/verify-otp.php` - Line 7

### To Disable Dev Mode (For Production):
Change in both files:
```php
define('DEV_BYPASS_OTP', false); // Production mode
```

### To Enable Dev Mode:
```php
define('DEV_BYPASS_OTP', true); // Development mode
```

---

**⚠️ IMPORTANT:** Remember to disable dev mode before going to production!

