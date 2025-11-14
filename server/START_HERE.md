# 🚀 START HERE - Deploy Your Project

## Follow These Steps in Order:

### ✅ STEP 1: Push Code to GitHub

**1.1 Open PowerShell/Terminal in your project folder**

**1.2 Initialize Git:**
```powershell
git init
git add .
git commit -m "Live MART project"
```

**1.3 Create GitHub Repository:**
- Go to: https://github.com/new
- Name: `live-mart`
- Make it **Public**
- Click "Create repository"

**1.4 Push Code:**
```powershell
git remote add origin https://github.com/YOUR_USERNAME/live-mart.git
git branch -M main
git push -u origin main
```
*(Replace YOUR_USERNAME with your actual GitHub username)*

---

### ✅ STEP 2: Deploy Backend (Railway)

**2.1 Sign Up:**
- Go to: https://railway.app
- Click "Start a New Project"
- Sign up with **GitHub**

**2.2 Deploy:**
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your repository
- Railway will auto-detect Node.js

**2.3 Add Environment Variables:**
Click on your service → "Variables" tab → Add these:

| Variable Name | Value |
|--------------|-------|
| `PORT` | `5000` |
| `JWT_SECRET` | `your_secret_key_12345` |
| `NODE_ENV` | `production` |

**2.4 Get Backend URL:**
- Go to "Settings" → "Domains"
- Copy the URL (e.g., `https://live-mart-api.up.railway.app`)
- **Save this URL!** You'll need it for frontend

---

### ✅ STEP 3: Deploy Frontend (Vercel)

**3.1 Sign Up:**
- Go to: https://vercel.com
- Sign up with **GitHub**

**3.2 Import Project:**
- Click "Add New..." → "Project"
- Import your GitHub repository

**3.3 Configure:**
- **Root Directory:** Type `client` ⚠️ (VERY IMPORTANT!)
- Framework: Create React App (auto-detected)

**3.4 Add Environment Variable:**
- Click "Environment Variables"
- Add:
  - **Key:** `REACT_APP_API_URL`
  - **Value:** `https://your-railway-url.up.railway.app/api`
  - (Use the URL from Step 2.4)

**3.5 Deploy:**
- Click "Deploy"
- Wait 2-3 minutes
- Copy your frontend URL (e.g., `https://live-mart.vercel.app`)

---

### ✅ STEP 4: Connect Frontend to Backend

**4.1 Update Railway Environment:**
- Go back to Railway
- Your Service → Variables
- Add: `FRONTEND_URL` = `https://your-vercel-url.vercel.app`
- (Use the URL from Step 3.5)

**4.2 Redeploy (automatic):**
- Railway will auto-redeploy when you add the variable

---

### ✅ STEP 5: Test & Share!

**5.1 Test:**
- Visit your Vercel URL
- Try registering a new account
- Test features

**5.2 Share with Professor:**
Send them these links:
- 🌐 **Website:** `https://your-app.vercel.app`
- 🔧 **API:** `https://your-api.up.railway.app/api`
- 💻 **Code:** `https://github.com/YOUR_USERNAME/live-mart`

---

## 🆘 Need Help?

### Backend Issues?
- Check Railway logs: Service → Deployments → View logs
- Make sure all environment variables are set

### Frontend Issues?
- Check Vercel build logs
- Verify `REACT_APP_API_URL` is correct
- Check browser console (F12)

### CORS Errors?
- Make sure `FRONTEND_URL` is set in Railway
- Wait for Railway to redeploy

---

## 📋 Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed on Railway
- [ ] Environment variables set in Railway
- [ ] Frontend deployed on Vercel
- [ ] `REACT_APP_API_URL` set in Vercel
- [ ] `FRONTEND_URL` set in Railway
- [ ] Tested the website
- [ ] All features working
- [ ] Ready to share!

---

## 🎯 Your Deployment URLs

After deployment, fill these in:

- **Frontend URL:** `https://________________.vercel.app`
- **Backend URL:** `https://________________.up.railway.app`
- **GitHub Repo:** `https://github.com/________________/live-mart`

**Good luck! 🚀**

