# Quick Deployment Steps

## Fastest Way to Deploy (15 minutes)

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - Live MART project"
git branch -M main

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/live-mart.git
git push -u origin main
```

### Step 2: Deploy Backend (Railway - 5 min)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables:
   - `PORT=5000`
   - `JWT_SECRET=your_secret_key`
   - (Others optional for basic demo)
6. Railway auto-deploys!
7. Copy the deployment URL (e.g., `https://live-mart-api.railway.app`)

### Step 3: Deploy Frontend (Vercel - 5 min)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project" → Import your repo
4. Configure:
   - Framework Preset: Create React App
   - Root Directory: `client`
   - Environment Variable: 
     - Key: `REACT_APP_API_URL`
     - Value: `https://your-railway-url.railway.app/api`
5. Deploy!
6. Copy the frontend URL

### Step 4: Share with Professor

Send them:
- Frontend URL (main website)
- Backend API URL (for reference)
- GitHub repository link
- Brief description of features

## Alternative: One-Click Deploy

### Using Render (Full Stack)

1. Go to https://render.com
2. Create account
3. New → Blueprint
4. Connect GitHub repo
5. Render will detect both services
6. Configure environment variables
7. Deploy both at once!

## Local Demo Alternative

If deployment is not possible:

1. **Screen Recording:**
   - Use OBS Studio (free) or Windows Game Bar
   - Record 10-minute demo
   - Upload to YouTube (unlisted)
   - Share link

2. **Live Demo:**
   - Run project locally
   - Use Zoom/Teams screen share
   - Show all features live

3. **Code Review:**
   - Share GitHub repository
   - Professor can review code
   - Include setup instructions

## What Your Professor Needs

**Minimum:**
- Working application (deployed or local)
- Code repository
- Brief documentation

**Ideal:**
- Deployed URLs (frontend + backend)
- GitHub repository
- Demo video (5-10 min)
- Screenshots
- Documentation

## Troubleshooting Deployment

**Backend Issues:**
- Ensure `PORT` is set correctly
- Check environment variables
- Verify `package.json` has start script

**Frontend Issues:**
- Update `REACT_APP_API_URL` to backend URL
- Ensure build completes successfully
- Check CORS settings in backend

**Database:**
- Railway/Render provide free PostgreSQL
- Or use the JSON file (works for demo)

