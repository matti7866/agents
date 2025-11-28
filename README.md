# Agent Portal - SNT Travel & Tourism

A professional agent portal for viewing customer residence processing progress and payment information.

## Features

✅ **Secure Agent Authentication**
- JWT-based login system
- Session management
- Login history tracking

✅ **Dashboard Overview**
- Total residences count
- Completed/In-progress statistics
- Payment summary
- Searchable and filterable residence list

✅ **Residence Processing Steps**
- View all 10 processing steps in sidebar
- Track progress for each residence
- See completion dates and status

✅ **Payment Statement (Ledger)**
- Multi-currency support
- Detailed transaction breakdown
- Outstanding balance tracking
- Payment history

✅ **Residence Details**
- Complete passenger information
- Establishment details
- Financial breakdown
- Processing timeline
- Step-by-step progress tracker

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: PHP REST API
- **Styling**: Custom CSS with modern design
- **Icons**: Font Awesome 6
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Alerts**: SweetAlert2

## Installation

1. **Install Dependencies**
   ```bash
   cd "/Applications/XAMPP/xamppfiles/htdocs/snt/AGENTS PORTAL"
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Portal**
   - Portal: http://localhost:5175
   - API Endpoint: http://127.0.0.1/snt/api

## API Endpoints

### Authentication
- `POST /api/agent/login.php` - Agent login
- `GET /api/agent/me.php` - Get agent profile

### Data
- `GET /api/agent/residences.php` - Get customer residences
- `GET /api/agent/residence-details.php?id={id}` - Get residence details
- `GET /api/agent/residence-ledger.php?currencyID={id}` - Get payment ledger

## Database Tables

### `agents` Table
- id (Primary Key)
- company (varchar)
- customer_id (Foreign Key)
- email (varchar)
- password (hashed)
- status (int) - 1: Active, 0: Inactive
- last_login_ip
- last_login_datetime
- datetime_added
- datetime_updated
- added_by
- deleted (int) - 0: Active, 1: Deleted

### `agents_login_history` Table
- id (Primary Key)
- agent_id (Foreign Key)
- datetime
- ip_address
- country

## Environment Configuration

The portal is configured to work with:
- Local XAMPP server
- API base URL: `http://127.0.0.1/snt/api`
- Dev server port: 5175

## Security Features

- JWT token authentication
- Password hashing (bcrypt)
- Protected API routes
- Login attempt logging
- IP address tracking
- Automatic token validation

## User Interface

### Login Page
- Modern gradient design
- Smooth animations
- Form validation
- Error handling

### Dashboard
- Statistics cards
- Search functionality
- Step filtering
- Responsive data tables

### Sidebar Navigation
- All 10 processing steps displayed
- Active step highlighting
- Quick access to ledger
- Logout functionality

### Residence Details
- Comprehensive information display
- Visual progress timeline
- Financial summary
- Responsive layout

### Payment Ledger
- Currency selector
- Aggregate totals
- Detailed breakdown
- Status indicators

## Build for Production

```bash
npm run build
```

The production build will be created in the `dist` folder.

## Notes

- This is a **read-only portal** - agents can only view information
- All data is filtered by the agent's customer_id
- Agents can only see residences belonging to their assigned customer
- The portal is fully responsive and mobile-friendly

## Support

For issues or questions, contact the development team.

© 2024 Selab Nadiry Travel & Tourism

