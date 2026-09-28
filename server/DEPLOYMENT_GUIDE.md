# 🚀 Vercel Deployment Guide

## Complete Step-by-Step Instructions for Deploying Your Backend to Vercel

---

## 📋 Prerequisites

Before deploying, ensure you have:
1. A [Vercel account](https://vercel.com/signup) (free tier works perfectly)
2. Your code pushed to a GitHub, GitLab, or Bitbucket repository
3. A MongoDB Atlas account with a database cluster set up
4. Your `.env` file values ready

---

## 🔧 Step 1: Configure MongoDB Atlas for Vercel

**WHY**: Vercel serverless functions use dynamic IP addresses, so we need to allow connections from any IP.

### Instructions:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in and select your project
3. Click **Network Access** in the left sidebar (under Security)
4. Click **+ ADD IP ADDRESS**
5. In the dialog:
   - Click **ALLOW ACCESS FROM ANYWHERE**
   - Or manually enter `0.0.0.0/0` in the IP Address field
6. Add a comment like "Vercel serverless functions"
7. Click **Confirm**

**WHAT THIS DOES**: Allows Vercel's serverless functions to connect to your MongoDB database from any IP address.

---

## 🌐 Step 2: Deploy to Vercel

### Option A: Deploy via GitHub (Recommended)

**WHY**: Automatic deployments on every push, preview deployments for pull requests, and easy rollbacks.

#### Instructions:

1. **Push your code to GitHub** (if not already done):
   ```bash
   cd server
   git init
   git add .
   git commit -m "Prepare backend for Vercel deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Go to Vercel Dashboard**:
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click **Add New...** → **Project**

3. **Import your repository**:
   - Select **Import Git Repository**
   - Choose your repository from the list
   - Click **Import**

4. **Configure the project**:
   - **Framework Preset**: Leave as "Other"
   - **Root Directory**: Click **Edit** and set to `server` (since your backend is inside the `server/` folder)
   - **Build Command**: Leave empty (Vercel will detect it automatically)
   - **Output Directory**: Leave empty

5. **Add Environment Variables**:
   Click **Environment Variables** and add these one by one:

   | Variable Name | Value | Example |
   |---|---|---|
   | `MONGO_URI` | Your MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
   | `PORT` | `3000` | `3000` |
   | `ACCESS_TOKEN_SECRET` | Your access token secret | `jxRinfOrN4EjvKmItspTSklfZaBcuIccvlTWspODopy` |
   | `REFRESH_TOKEN_SECRET` | Your refresh token secret | `PZaX3uGT3zRV9VfUDoVwegxDJvIZ26HbhQldkkbps24` |
   | `NODE_ENV` | `production` | `production` |

   **IMPORTANT**: Click **Add** after entering each variable!

6. **Deploy**:
   - Click **Deploy**
   - Wait 1-3 minutes for the build to complete
   - You'll get a production URL like `https://your-project-name.vercel.app`

---

### Option B: Deploy via Vercel CLI

**WHY**: Faster for quick deployments, no need to push to GitHub first.

#### Instructions:

1. **Install Vercel CLI globally**:
   ```bash
   npm install -g vercel
   ```

2. **Navigate to your server directory**:
   ```bash
   cd server
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```
   Follow the prompts to authenticate.

4. **Deploy**:
   ```bash
   vercel
   ```
   
   Follow the interactive prompts:
   - **Set up and deploy**: `Y`
   - **Which scope**: Select your account
   - **Link to existing project**: `N` (first time) or `Y` (if already created)
   - **Project name**: Enter a name (e.g., `backend-task`)
   - **Directory**: Confirm it's the current directory
   - **Override settings**: `N`

5. **Add Environment Variables** (after first deployment):
   - Go to your [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project
   - Go to **Settings** → **Environment Variables**
   - Add all the variables listed in Option A Step 5

6. **Redeploy with environment variables**:
   ```bash
   vercel --prod
   ```

---

## 🔍 Step 3: Test Your Deployment

### Get your production URL:
After deployment, Vercel will provide a URL like:
```
https://backend-task-abc123.vercel.app
```

### Test the API:

1. **Health check** (optional - create a test route):
   ```bash
   curl https://your-backend.vercel.app/api/products
   ```

2. **Test registration**:
   ```bash
   curl -X POST https://your-backend.vercel.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123",
       "confirmPassword": "password123"
     }'
   ```

3. **Test login**:
   ```bash
   curl -X POST https://your-backend.vercel.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

**WHAT TO EXPECT**: You should get JSON responses with `success: true` and user data.

---

## 🎨 Step 4: Update Your Frontend

Now that your backend is deployed, update the frontend to use the production API URL.

### Update `client/src/services/api.js`:

```javascript
import axios from "axios";

const api = axios.create({
  // Use environment variable in production, fallback to deployed Vercel URL
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://your-backend.vercel.app/api",
  withCredentials: true,
});

// ... rest of the file remains the same
```

### Create `client/.env.production`:

```
VITE_API_BASE_URL=https://your-backend.vercel.app/api
```

**WHY**: This ensures your frontend always points to the correct backend URL in production.

---

## 🔄 Step 5: Continuous Deployment (GitHub Only)

**WHAT**: Every time you push to GitHub, Vercel automatically redeploys.

### How it works:
1. Make changes to your backend code
2. Commit and push:
   ```bash
   git add .
   git commit -m "Update order controller"
   git push origin main
   ```
3. Vercel automatically detects the push and redeploys
4. You'll receive an email when deployment completes

### Preview Deployments:
- Create a new branch: `git checkout -b feature/new-endpoint`
- Make changes and push: `git push origin feature/new-endpoint`
- Create a pull request on GitHub
- Vercel creates a **preview URL** for testing before merging to main

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution**: 
- Verify MongoDB Atlas Network Access allows `0.0.0.0/0`
- Check that `MONGO_URI` environment variable is correct in Vercel dashboard
- Ensure your MongoDB cluster is active (not paused)

### Issue: "500 Internal Server Error" on all routes
**Solution**:
- Check Vercel function logs: Dashboard → Your Project → **Functions** tab → Click on `/api/index.js`
- Look for missing environment variables
- Verify `NODE_ENV=production` is set

### Issue: "Refresh token not working" / "CORS errors"
**Solution**:
- Ensure `NODE_ENV=production` is set in Vercel environment variables
- This enables `secure: true` and `sameSite: "none"` for cookies
- Check that frontend is sending `withCredentials: true` in axios requests

### Issue: "Function timeout"
**Solution**:
- Vercel free tier has a 10-second timeout for serverless functions
- If database queries are slow, add indexes to your MongoDB collections
- Optimize complex aggregations or move them to background jobs

---

## 📊 Monitoring Your Deployment

### View Logs:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Deployments**
4. Click on any deployment
5. Click **Functions** tab
6. Click on `/api/index.js` to see real-time logs

### Check Analytics:
- Go to **Analytics** tab in your project dashboard
- View request counts, response times, and error rates

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas allows `0.0.0.0/0` IP access
- [ ] Code pushed to GitHub (or ready for CLI deployment)
- [ ] Vercel project created and linked to repository
- [ ] Root directory set to `server`
- [ ] All 5 environment variables added to Vercel
- [ ] First deployment successful
- [ ] API endpoints tested and working
- [ ] Frontend updated with production API URL
- [ ] Cookies working across domains (test login/logout)

---

## 🎉 You're Done!

Your backend is now live on Vercel! 

**Production URL**: `https://your-project-name.vercel.app`

Every push to your `main` branch will automatically trigger a new deployment.

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [Environment Variables in Vercel](https://vercel.com/docs/projects/environment-variables)
