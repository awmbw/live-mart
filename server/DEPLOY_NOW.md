# 🚀 Deploy Live MART in 15 Minutes

## Quick Start Guide

### STEP 1: Push to GitHub (5 minutes)

1. **Open terminal in your project folder**

2. **Initialize Git (if needed):**
```bash
git init
git add .
git commit -m "Live MART project - ready for deployment"
```

3. **Create GitHub Repository:**
   - Go to https://github.com/new
   - Repository name: `live-mart`
   - Make it **Public**
   - Click "Create repository"

4. **Push to GitHub:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/live-mart.git
git branch -M main
git push -u origin main
```
*(Replace YOUR_USERNAME with your GitHub username)*

---

### STEP 2: Deploy Backend on Railway (5 minutes)

1. **Sign Up:**
   - Go to https://railway.app
   - Click "Start a New Project"
   - Sign up with **GitHub** (easiest)

2. **Deploy:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `live-mart` repository
   - Railway auto-detects it's Node.js

3. **Configure Environment Variables:**
   - Click on your deployed service
   - Go to "Variables" tab
   - Click "New Variable" and add:
     ```
     PORT = 5000
     JWT_SECRET = any_random_string_12345
     NODE_ENV = production
     ```
   - (Email/SMS optional for demo)

4. **Get Your Backend URL:**
   - Go to "Settings" → "Domains"
   - Railway gives you: `your-project.up.railway.app`
   - **Copy this URL!** (e.g., `https://live-mart-api.up.railway.app`)
   - Your API: `https://your-project.up.railway.app/api`

---

### STEP 3: Deploy Frontend on Vercel (5 minutes)

1. **Sign Up:**
   - Go to https://vercel.com
   - Click "Sign Up"
   - Sign up with **GitHub**

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Import your `live-mart` GitHub repository

3. **Configure:**
   - **Framework Preset:** Create React App (auto-detected)
   - **Root Directory:** Type `client` ⚠️ (IMPORTANT!)
   - **Build Command:** `npm run build` (auto)
   - **Output Directory:** `build` (auto)

4. **Add Environment Variable:**
   - Click "Environment Variables"
   - Click "Add"
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://your-railway-url.up.railway.app/api`
   - (Use the backend URL from Step 2.4)

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Vercel gives you: `https://live-mart.vercel.app`
   - **Copy this URL!**

---

### STEP 4: Update CORS (2 minutes)

1. **Update server/index.js:**
   - The CORS is already configured to accept your frontend URL
   - Just add your Vercel URL to Railway environment variables:
     - Go to Railway → Your Service → Variables
     - Add: `FRONTEND_URL = https://your-vercel-url.vercel.app`

2. **Or manually update server/index.js:**
   ```javascript
   app.use(cors({
     origin: [
       'http://localhost:3000',
       'https://your-vercel-url.vercel.app'
     ],
     credentials: true
   }));
   ```
   - Commit and push to GitHub
   - Railway auto-redeploys

---

### STEP 5: Test & Share! 🎉

1. **Test Your Site:**
   - Visit your Vercel URL
   - Try registering a new account
   - Test features

2. **Share with Professor:**
   - **Website:** `https://your-app.vercel.app`
   - **API:** `https://your-api.up.railway.app/api`
   - **Code:** `https://github.com/YOUR_USERNAME/live-mart`

---

## 🆘 Troubleshooting

### Backend Not Working?
- Check Railway logs: Service → Deployments → View logs
- Verify environment variables are set
- Check if PORT is correct

### Frontend Not Connecting?
- Check Vercel build logs
- Verify `REACT_APP_API_URL` matches your Railway URL
- Open browser DevTools → Console for errors

### CORS Errors?
- Make sure frontend URL is in backend CORS
- Check Railway environment variable `FRONTEND_URL`

---

## ✅ Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed on Railway
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set
- [ ] CORS configured
- [ ] Tested registration/login
- [ ] All features working
- [ ] URLs ready to share

---

## 🎯 Quick Links

- **Railway:** https://railway.app
- **Vercel:** https://vercel.com
- **GitHub:** https://github.com

**You're all set! Good luck! 🚀**

