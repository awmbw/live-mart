# Deployment Guide for Live MART

## Option 1: Deploy to Free Hosting Services (Recommended)

### Backend Deployment (Railway, Render, or Heroku)

#### Using Railway (Easiest - Free Tier Available)

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub repository
4. Add environment variables from `.env.example`
5. Railway will automatically detect Node.js and deploy

#### Using Render (Free Tier Available)

1. Go to [render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Settings:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && node index.js`
   - Environment: Node
5. Add environment variables
6. Deploy

#### Using Heroku

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Login: `heroku login`
3. Create app: `heroku create live-mart-api`
4. Set environment variables: `heroku config:set JWT_SECRET=your_secret`
5. Deploy: `git push heroku main`

### Frontend Deployment (Vercel or Netlify - Recommended)

#### Using Vercel (Easiest - Free)

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "New Project" → Import your GitHub repo
3. Select the `client` folder
4. Add environment variable:
   - `REACT_APP_API_URL` = your backend URL (e.g., `https://your-api.railway.app/api`)
5. Deploy

#### Using Netlify (Free)

1. Go to [netlify.com](https://netlify.com) and sign up
2. Click "New site from Git" → Connect GitHub
3. Build settings:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/build`
4. Add environment variable: `REACT_APP_API_URL`
5. Deploy

## Option 2: Create a Demo Video

1. Record your screen showing:
   - Registration process
   - Product browsing
   - Order placement
   - Dashboard features
   - All user roles (Customer, Retailer, Wholesaler)
2. Upload to YouTube (unlisted) or Google Drive
3. Share the link with your professor

## Option 3: Local Demo with Screen Sharing

1. Run the project locally
2. Use Zoom/Teams/Google Meet to share your screen
3. Demonstrate all features live

## Option 4: Package for Submission

Create a zip file with:
- All source code
- README with setup instructions
- Screenshots of the application
- Video demo (optional)

## Quick Deployment Checklist

- [ ] Push code to GitHub
- [ ] Deploy backend (Railway/Render/Heroku)
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Update frontend API URL
- [ ] Test all features
- [ ] Create demo video
- [ ] Document deployment URLs

