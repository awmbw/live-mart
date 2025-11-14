# Live MART - Setup Instructions

## Quick Start Guide

### 1. Install Dependencies

From the project root:
```bash
npm run install-all
```

Or separately:
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` in the server directory and update with your credentials:
- Email settings for OTP (Gmail recommended)
- Twilio credentials for SMS (optional)
- Google Maps API key (optional)

### 3. Run the Application

From project root:
```bash
npm run dev
```

This runs both backend (port 5000) and frontend (port 3000) concurrently.

Or run separately:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Features Implemented

✅ Multi-role registration (Customer/Retailer/Wholesaler)
✅ OTP verification via email/SMS
✅ Social login support
✅ Product management
✅ Order management with tracking
✅ Search and filtering
✅ Location-based shop finding
✅ Feedback system
✅ Real-time notifications
✅ Dashboard for all user types

## Default Categories

- Groceries 🛒
- Electronics 📱
- Clothing 👕
- Home & Kitchen 🏠
- Health & Beauty 💄
- Local Products 🌾

## Testing the Application

1. Register as a Customer, Retailer, or Wholesaler
2. For Retailers/Wholesalers: Add products via Dashboard
3. For Customers: Browse products, add to cart, place orders
4. Track orders and update status (for retailers/wholesalers)
5. Leave feedback on products

## Notes

- Database is stored in `server/data/database.json`
- OTP is stored in memory (use Redis for production)
- Email/SMS services need proper configuration
- Google Maps API is optional for location features

