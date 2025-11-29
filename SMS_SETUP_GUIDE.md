# SMS Test Page Setup Guide

## Overview
A test page has been created to send SMS messages using the E&N Enterprise SMS API. This allows you to test the SMS functionality before implementing it across other pages.

## Files Created

### 1. Backend API Endpoint
**File**: `send_sms.php`
- Handles SMS sending requests from the frontend
- Validates input (phone number and message)
- Communicates with E&N Enterprise SMS API
- Returns success/error responses

### 2. Frontend Test Page
**Files**: 
- `src/pages/TestSMS.tsx` - React component
- `src/pages/TestSMS.css` - Styling

**Features**:
- Simple form to enter phone number and message
- Real-time character counter (max 500 chars)
- Loading states while sending
- Success/error message display
- API information panel with tips

### 3. Navigation
- Added route in `src/App.tsx`
- Added navigation link in `src/components/Layout.tsx`

## How to Use

1. **Start your development server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Access the Test SMS page**:
   - Login to the portal
   - Click on "Test SMS" in the sidebar navigation
   - Or navigate to: `http://localhost:5173/test-sms`

3. **Send a test SMS**:
   - Enter a phone number with country code (e.g., `971501234567`)
   - Type your message (max 500 characters)
   - Click "Send Test SMS"
   - Wait for the result

## Deployment to Production

### Important: Deploy the PHP file
When deploying to production, make sure to upload `send_sms.php` to your production server:

```bash
# The file should be placed at:
https://rest.sntrips.com/api/send_sms.php
```

### Steps:
1. Build the React app:
   ```bash
   npm run build
   ```

2. Upload `send_sms.php` to your production server's API directory

3. Verify the file is accessible at:
   ```
   https://rest.sntrips.com/api/send_sms.php
   ```

## Phone Number Format
- Always include country code
- No spaces, dashes, or special characters
- Example formats:
  - ✅ `971501234567` (UAE)
  - ✅ `966501234567` (Saudi Arabia)
  - ✅ `201234567890` (Egypt)
  - ❌ `+971 50 123 4567` (has spaces and +)
  - ❌ `050-123-4567` (missing country code and has dashes)

## SMS API Details
- **Provider**: E&N Enterprise
- **Endpoint**: `https://nexus.eandenterprise.com/api/v1/sms/send`
- **Sender ID**: SNTRAVEL
- **Category**: TXN (Transactional)
- **Authentication**: Bearer token (already configured)

## Troubleshooting

### Common Issues:

1. **CORS Error**:
   - Make sure `send_sms.php` has proper CORS headers (already included)
   - Check browser console for detailed errors

2. **401 Unauthorized**:
   - The Bearer token may have expired
   - Contact your developer to get a new token
   - Update the token in `send_sms.php` (line 47)

3. **Network Error**:
   - Verify the PHP file is accessible
   - Check your internet connection
   - Ensure XAMPP/Apache is running for local testing

4. **SMS not received**:
   - Verify the phone number format
   - Check if the number is registered in the SMS API
   - Some numbers may be blocked or invalid

## Future Implementation

Once testing is successful, you can implement SMS functionality in other pages by:

1. **Creating a reusable SMS service**:
   ```typescript
   // src/services/smsService.ts
   export async function sendSMS(recipient: string, message: string) {
     const response = await fetch('https://rest.sntrips.com/api/send_sms.php', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ recipient, message })
     });
     return response.json();
   }
   ```

2. **Use cases for SMS**:
   - Send OTP for login/verification
   - Notify agents about residence status changes
   - Send payment reminders
   - Alert about document updates
   - Emergency notifications

## Security Notes

⚠️ **Important**: The Bearer token in `send_sms.php` should be:
- Kept secure and not exposed in frontend code
- Rotated periodically for security
- Only accessible from server-side code

## Support
If you encounter any issues or need help implementing SMS on other pages, refer to this guide or contact your developer.

---
Last Updated: November 29, 2025

