# 🚀 Quick Start Guide - Agent Portal

## ✅ Status: Portal is Running!

Your Agent Portal is now live at:
- **Portal URL**: http://localhost:5175
- **API Base**: http://127.0.0.1/snt/api

---

## 📋 Setup Steps

### 1. Create Test Agent
Open this helper page in your browser:
```
http://127.0.0.1/snt/AGENTS%20PORTAL/create_agent.php
```

This will allow you to:
- ✅ Create agent accounts easily
- ✅ Select customer association
- ✅ View existing agents
- ✅ Automatic password hashing

### 2. Login to Portal
1. Go to http://localhost:5175
2. Use the credentials you just created
3. Default test credentials (if you used setup):
   - Email: `agent@test.com`
   - Password: `password123`

---

## 🎯 Features Available

### Dashboard
- View all residences for your customer
- See statistics (Total, Completed, In Progress, Payments)
- Search and filter by step
- Click "View" to see residence details

### Sidebar Navigation
- **Dashboard** - Main overview
- **Payment Statement** - Detailed ledger with multi-currency support
- **Processing Steps** - All 10 residence processing steps displayed:
  1. Offer Letter
  2. Insurance
  3. Labour Card
  4. E-Visa
  5. Change Status
  6. Medical
  7. Emirates ID
  8. Visa Stamping
  9. Contract Submission
  10. Completed

### Residence Details
- Complete passenger information
- Establishment details
- Financial breakdown
- Visual progress timeline
- Step-by-step completion tracker

### Payment Ledger
- Select currency to view
- Total charges, paid amount, and balance
- Detailed breakdown per residence
- Status indicators

---

## 🔐 Security Features

✅ JWT Authentication
✅ Password Hashing (bcrypt)
✅ Login History Tracking
✅ IP Address Logging
✅ Protected API Routes
✅ Customer-scoped Data (agents only see their customer's data)

---

## 🗄️ Database Tables Used

### `agents`
Stores agent credentials and information

### `agents_login_history`
Tracks all login attempts with IP and timestamp

### `residence`
Main residence data (filtered by customer_id)

### `customer`
Customer information

### `customer_payments`
Payment transactions

### All other residence-related tables
(residencefine, residence_charges, residence_custom_charges, etc.)

---

## 🛠️ Development Commands

```bash
# Navigate to portal directory
cd "/Applications/XAMPP/xamppfiles/htdocs/snt/AGENTS PORTAL"

# Install dependencies (already done)
npm install

# Start dev server (already running)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📝 Important Notes

1. **Read-Only Portal**: Agents can only VIEW data, not modify it
2. **Customer Scoped**: Each agent only sees data for their assigned customer
3. **Secure**: All API endpoints verify JWT tokens and customer association
4. **Responsive**: Works on desktop, tablet, and mobile devices

---

## 🎨 Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: PHP REST API with JWT
- **Database**: MySQL (existing sntravels_prod)
- **Styling**: Custom CSS
- **Icons**: Font Awesome 6
- **Alerts**: SweetAlert2

---

## 🔄 How It Works

1. **Agent Login** → Validates credentials → Returns JWT token
2. **Token Storage** → Saved in localStorage
3. **API Requests** → Token sent in Authorization header
4. **Backend Verification** → Checks token + customer_id match
5. **Data Filtering** → Only shows data for agent's customer
6. **Login History** → Every login is logged with IP and country

---

## 🐛 Troubleshooting

### Portal won't load?
- Check if dev server is running (should be on http://localhost:5175)
- Restart with: `npm run dev`

### Can't login?
- Make sure agent exists in database
- Check agent status = 1 (active)
- Verify password is correct
- Check browser console for errors

### No data showing?
- Ensure agent's customer_id has residences
- Check residence table for data with matching customer_id
- Verify API endpoints return data (check Network tab)

### API errors?
- Ensure XAMPP/Apache is running
- Check PHP error logs
- Verify database connection in connection.php

---

## 🎉 You're All Set!

The portal is ready to use. Create agents using the helper script and start exploring!

**Need Help?**
- Check the full README.md for detailed documentation
- Review API endpoints in /api/agent/ folder
- Check browser console for frontend errors
- Check PHP error logs for backend issues

---

© 2024 Selab Nadiry Travel & Tourism

