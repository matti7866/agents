# 🚀 Deployment Guide - Agent Portal

## Architecture

The Agent Portal consists of two parts:

1. **React Frontend** (TypeScript + Vite)
2. **PHP Backend API** (runs on your server with MySQL)

---

## 📍 API Configuration Locations

All API URLs are currently configured in individual files:

### Frontend Files (React):
- `src/context/AuthContext.tsx` - Line 21
- `src/pages/Dashboard.tsx` - Line 7  
- `src/pages/Ledger.tsx` - Line 6
- `src/pages/ResidenceDetails.tsx` - Line 6
- `src/pages/ForgotPassword.tsx` - Line 6
- `src/pages/ResetPassword.tsx` - Line 6

### Current API URL:
```typescript
const API_BASE_URL = 'http://127.0.0.1/snt/api';
```

### For Production:
Update to your production domain:
```typescript
const API_BASE_URL = 'https://app.sntrips.com/api';
// or
const API_BASE_URL = 'https://your-domain.com/snt/api';
```

---

## 🏗️ Deployment Methods

### Method 1: Deploy to cPanel/Shared Hosting (Recommended)

**Step 1: Deploy Backend (PHP API)**
1. Upload all PHP API files from `/snt/api/agent/` to your server:
   - `login.php`
   - `me.php`
   - `residences.php`
   - `residence-details.php`
   - `residence-ledger.php`
   - `forgot-password.php`
   - `reset-password.php`
   - `change-password.php`
   - `send-otp.php` (optional)
   - `verify-otp.php` (optional)

2. Upload helper files:
   - `create_agent.php`
   - `check_otp_columns.php`
   - `fix_login_history.php`
   - All `.sql` setup files

**Step 2: Setup Database**
1. Run the SQL setup scripts in phpMyAdmin:
   - Ensure `agents` table exists
   - Run `check_otp_columns.php` or manually add columns
   - Run `fix_login_history.php` or fix the table
   - Create test agents using `create_agent.php`

**Step 3: Build Frontend**
```bash
cd "/Applications/XAMPP/xamppfiles/htdocs/snt/AGENTS PORTAL"

# Update API URL to production first!
# Edit all files listed above to use production URL

# Then build
npm run build
```

**Step 4: Deploy Frontend**
1. Upload contents of `dist/` folder to your server
2. Place in a directory like `public_html/agent-portal/`
3. Access at: `https://your-domain.com/agent-portal/`

---

### Method 2: Keep Local + GitHub (Current Setup)

**Advantages:**
- Already working perfectly
- Easy to develop and test
- No deployment complexity

**Usage:**
- Agents can't access remotely
- Only works on your local machine
- Good for development and testing

---

### Method 3: VPS/Cloud Server Deployment

Deploy to a VPS with PHP support:
- AWS EC2, DigitalOcean, Linode, Vultr
- Install LAMP/LEMP stack (Linux, Apache/Nginx, MySQL, PHP)
- Upload full project
- Configure domain and SSL

---

## 🔒 Security Checklist for Production

Before deploying to production:

1. **Disable Dev Mode**
   - In `/api/agent/send-otp.php`: Set `DEV_BYPASS_OTP = false`
   - In `/api/agent/verify-otp.php`: Set `DEV_BYPASS_OTP = false`

2. **Update API URLs**
   - Change all `http://127.0.0.1/snt/api` to production URL
   - Or use the centralized config in `src/config/api.ts`

3. **Secure JWT Secret**
   - Update secret key in `/api/auth/JWTHelper.php`
   - Use a strong, random secret

4. **Configure CORS**
   - Update allowed origins in `/api/cors-headers.php`
   - Add your production domain

5. **SSL Certificate**
   - Ensure HTTPS is enabled
   - Update reset password links to use HTTPS

6. **Database Security**
   - Use strong database passwords
   - Limit database user permissions
   - Enable only necessary privileges

---

## 📦 Files to Deploy

### Backend (PHP) - Upload to server:
```
/snt/api/agent/*.php
/snt/AGENTS PORTAL/*.php
/snt/AGENTS PORTAL/*.sql
```

### Frontend (React) - Build and upload:
```bash
npm run build
# Then upload dist/* to server
```

---

## 🌐 Environment Variables (.env)

Create a `.env` file for production:
```env
VITE_API_BASE_URL=https://your-domain.com/snt/api
```

Then update code to use:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1/snt/api';
```

---

## ⚡ Quick Fix for Cloudflare Pages

Cloudflare Pages **cannot run PHP**. You have two options:

1. **Deploy frontend only to Cloudflare, keep backend on your PHP server**
   - Build: `npm run build`
   - Upload `dist/` to Cloudflare
   - Backend stays on app.sntrips.com
   - Update API URLs to production

2. **Deploy everything to a PHP-compatible host instead**
   - Use cPanel, VPS, or traditional hosting
   - Both frontend and backend on same server

---

## 💡 Recommendation

For your use case, I recommend:

**Keep it local for now** (already working perfectly) OR **deploy to your existing production server** (app.sntrips.com) where your main application runs, since it already has PHP + MySQL.

Would you like me to:
- A) Create a centralized API config system?
- B) Help deploy to your production server?
- C) Keep it local (already working)?

