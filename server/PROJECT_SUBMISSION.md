# Live MART - Project Submission Guide

## For Your Professor

### Option 1: Live Demo (Best Option)

**If you can schedule a live demo:**
1. Run the project locally
2. Share your screen via Zoom/Teams
3. Demonstrate all features
4. Show code structure

### Option 2: Deployed Application (Recommended)

**Deploy to free hosting:**
- Backend: Railway.app or Render.com
- Frontend: Vercel.com or Netlify.com
- Share the live URLs with your professor

### Option 3: Video Demonstration

**Create a comprehensive video showing:**
1. Project overview and features
2. Registration (all 3 roles)
3. Product management (Retailer/Wholesaler)
4. Shopping and ordering (Customer)
5. Order tracking and management
6. Search and filtering
7. Feedback system
8. Dashboard features

### Option 4: Code Submission Package

**Include in your submission:**
1. Complete source code (zip file)
2. README.md with setup instructions
3. Screenshots of all features
4. Video demo (YouTube/GDrive link)
5. Deployment URLs (if deployed)

## What to Include in Submission

### 1. Documentation
- Project description
- Features implemented
- Technology stack
- Setup instructions
- API documentation

### 2. Screenshots
- Home page
- Registration/Login
- Product listing
- Shopping cart
- Order management
- Dashboard (all roles)
- Search functionality
- Feedback system

### 3. Demo Video
- 5-10 minute walkthrough
- Show all 5 modules
- Demonstrate all user roles
- Highlight key features

### 4. Code Repository
- GitHub/GitLab link
- Well-organized code
- Comments where necessary
- Clean project structure

## Quick Setup for Professor

If your professor wants to run it locally:

```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install

# 2. Configure environment
# Copy server/.env.example to server/.env

# 3. Run servers
# Terminal 1:
cd server && npm run dev

# Terminal 2:
cd client && npm start

# 4. Access at http://localhost:3000
```

## Features to Highlight

✅ **Module 1:** Multi-role registration with OTP verification
✅ **Module 2:** Category-wise product listing with details
✅ **Module 3:** Advanced search with location-based filtering
✅ **Module 4:** Complete order management with tracking
✅ **Module 5:** Feedback system with real-time updates

## Test Accounts (Optional)

You can create test accounts for your professor:
- Customer: customer@test.com
- Retailer: retailer@test.com
- Wholesaler: wholesaler@test.com

(Note: They'll need to verify OTP during registration)

