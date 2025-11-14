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

### STEP 2: Deploy Backend on Render (5 minutes) ⭐ RECOMMENDED (Free Tier Available)

**Note:** Railway's free tier is limited. Render offers a better free tier for Node.js apps.

1. **Sign Up:**
   - Go to https://render.com
   - Click "Get Started for Free"
   - Sign up with **GitHub** (easiest)

2. **Deploy:**
   - Click "New +" → "Web Service"
   - Connect your GitHub account if not already connected
   - Select your `live-mart` repository
   - Render auto-detects it's Node.js

3. **Configure:**
   - **Name:** `live-mart-api` (or any name you like)
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** `server` ⚠️ (IMPORTANT!)
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` or `node index.js`
   - **Plan:** Select **Free** plan
   - Click "Create Web Service"

4. **Configure Environment Variables:**
   - In your service dashboard, go to "Environment" tab
   - Click "Add Environment Variable" and add:
     ```
     PORT = 5000
     JWT_SECRET = any_random_string_12345
     NODE_ENV = production
     ```
   - (Email/SMS optional for demo)

5. **Get Your Backend URL:**
   - Render automatically gives you a URL: `your-service-name.onrender.com`
   - It's shown at the top of your service dashboard
   - **Copy this URL!** (e.g., `https://live-mart-api.onrender.com`)
   - Your API: `https://your-service-name.onrender.com/api`
   - **Note:** Free tier services spin down after 15 min of inactivity (first request may be slow)

---

### Alternative: Deploy Backend on Fly.io (Free Tier Available)

1. **Sign Up:**
   - Go to https://fly.io
   - Sign up with GitHub

2. **Install Fly CLI:**
   ```bash
   # Windows (PowerShell)
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

3. **Deploy:**
   ```bash
   cd server
   fly launch
   # Follow prompts, choose free plan
   fly deploy
   ```

4. **Get URL:**
   - Fly gives you: `your-app.fly.dev`
   - Your API: `https://your-app.fly.dev/api`

---

### STEP 3: Deploy Frontend on Vercel (5 minutes)

1. **Sign Up:**
   - Go to https://vercel.com
   - Click "Sign Up"
   - Sign up with **GitHub**

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Select your `live-mart` GitHub repository (you should see `awmbw/live-mart` or your username)
   - **Note:** You can leave "Public Repository Name" as default or change it
   - Click "Create" button at the bottom

3. **Configure Project Settings:**
   - Vercel will now show a configuration screen
   - **Framework Preset:** Create React App (auto-detected) - leave as is
   - **Root Directory:** ⚠️ **IMPORTANT!** Click on "Root Directory" and change it from `.` to `client`
   - **Build Command:** `npm run build` (should be auto-filled)
   - **Output Directory:** `build` (should be auto-filled)
   - Click "Deploy" button to start deployment

4. **Add Environment Variable:**
   - Click "Environment Variables"
   - Click "Add"
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://your-render-url.onrender.com/api` (or your Fly.io URL if using that)
   - (Use the backend URL from Step 2.5)

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Vercel gives you: `https://live-mart.vercel.app`
   - **Copy this URL!**

---

### STEP 4: Update CORS (2 minutes)

1. **Update server/index.js:**
   - The CORS is already configured to accept your frontend URL
   - Just add your Vercel URL to Render environment variables:
     - Go to Render → Your Service → Environment tab
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
   - Render auto-redeploys

---

### STEP 5: Test & Share! 🎉

1. **Test Your Site:**
   - Visit your Vercel URL
   - Try registering a new account
   - Test features

2. **Share with Professor:**
   - **Website:** `https://your-app.vercel.app`
   - **API:** `https://your-api.onrender.com/api` (or your Fly.io URL)
   - **Code:** `https://github.com/YOUR_USERNAME/live-mart`

---

## 🆘 Troubleshooting

### Backend Not Working?
- Check Render logs: Service → Logs tab (or Fly.io: `fly logs`)
- Verify environment variables are set
- Check if PORT is correct
- **Render free tier:** Services spin down after 15 min inactivity (first request may take 30-60 seconds)

### npm install Failed? (Exit Code 1)
- **On Vercel:**
  - Make sure Root Directory is set to `client` (not `.`)
  - Check build logs for specific error message
  - Try clearing Vercel cache: Project Settings → General → Clear Build Cache
  - Ensure Node.js version is 16+ (Vercel auto-detects, but you can set it in Project Settings)
- **On Render:**
  - Make sure Root Directory is set to `server` (not `.`)
  - Check service logs for specific error
  - Verify Node.js version in environment variables (NODE_VERSION = 18 or 20)
- **Common fixes:**
  - Delete `node_modules` and `package-lock.json` locally, then commit fresh `package-lock.json`
  - Make sure `react-scripts` is in `dependencies` (not `devDependencies`) for client
  - Check if any packages are deprecated (like `react-google-login`)

### Frontend Not Connecting?
- Check Vercel build logs
- Verify `REACT_APP_API_URL` matches your Render/Fly.io URL
- Open browser DevTools → Console for errors

### CORS Errors?
- Make sure frontend URL is in backend CORS
- Check Render/Fly.io environment variable `FRONTEND_URL`

---

## ✅ Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed on Render (or Fly.io)
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set
- [ ] CORS configured
- [ ] Tested registration/login
- [ ] All features working
- [ ] URLs ready to share

---

## 🎯 Quick Links

- **Render:** https://render.com (Recommended - Free tier available)
- **Fly.io:** https://fly.io (Alternative - Free tier available)
- **Vercel:** https://vercel.com
- **GitHub:** https://github.com

**You're all set! Good luck! 🚀**

