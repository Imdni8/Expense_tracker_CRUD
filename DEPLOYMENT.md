# Deployment Guide - Expense Tracker PWA

This guide covers deploying the Expense Tracker app to Render.com with MongoDB Atlas.

---

## Prerequisites

- GitHub account with this repository
- MongoDB Atlas account (free tier is sufficient)
- Render.com account (free tier available)

---

## Part 1: MongoDB Atlas Setup

### Step 1: Fix Database Connection & IP Whitelist

Your MongoDB Atlas cluster needs to allow connections from Render's servers.

1. **Log in to MongoDB Atlas** at https://cloud.mongodb.com

2. **Whitelist All IP Addresses** (for Render deployment):
   - Click on your cluster → "Network Access" (left sidebar)
   - Click "ADD IP ADDRESS"
   - Click "ALLOW ACCESS FROM ANYWHERE"
   - This adds `0.0.0.0/0` which allows Render servers to connect
   - Click "Confirm"
   - Wait 1-2 minutes for changes to propagate

   > **Note**: For production apps with sensitive data, you can whitelist specific Render IP ranges instead.

3. **Verify Database User Exists**:
   - Go to "Database Access" (left sidebar)
   - Confirm user `tousifrahaman` exists with password access
   - If you need to create a new user:
     - Click "ADD NEW DATABASE USER"
     - Username: (choose any)
     - Password: (choose secure password - save this!)
     - Database User Privileges: "Read and write to any database"
     - Click "Add User"

4. **Get Your Connection String**:
   - Click "Clusters" → "Connect" (on your cluster)
   - Choose "Connect your application"
   - Driver: Node.js, Version: 4.1 or later
   - Copy the connection string, it looks like:
     ```
     mongodb+srv://<username>:<password>@clustermsw.y7erane.mongodb.net/expenseApp?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your actual credentials
   - Make sure it ends with `/expenseApp` (or your database name)

---

## Part 2: Deploy to Render.com

### Step 1: Prepare Repository

Your repository is already configured for Render! All necessary files are in place:
- ✅ `package.json` with `"start": "node index.js"` script
- ✅ `index.js` with `process.env.PORT` configuration
- ✅ PWA assets in `/public` directory
- ✅ `.gitignore` excludes `node_modules` and `.env`

### Step 2: Create Render Web Service

1. **Sign up/Log in to Render** at https://render.com

2. **Connect GitHub**:
   - Click "New +" → "Web Service"
   - Click "Connect account" under GitHub
   - Authorize Render to access your repositories

3. **Select Repository**:
   - Find and select `Imdni8/Expense_tracker_CRUD`
   - Click "Connect"

4. **Configure Web Service**:

   Fill in these settings:

   - **Name**: `expense-tracker-gnw` (or any name you like)
   - **Region**: Choose closest to you
   - **Branch**: `claude/run-project-verification-01P3H11d4EcctB7tk2Vp3cDj` (or `main` if you've merged)
   - **Root Directory**: Leave blank
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. **Add Environment Variables**:

   Scroll down to "Environment Variables" and add these:

   | Key | Value |
   |-----|-------|
   | `db_URL` | Your MongoDB connection string from Part 1 Step 4 |
   | `RENDER_URL` | Leave blank for now (we'll update after first deploy) |
   | `NODE_ENV` | `production` |

   Example `db_URL`:
   ```
   mongodb+srv://tousifrahaman:WCAAgOvq95LslUKZ@clustermsw.y7erane.mongodb.net/expenseApp?retryWrites=true&w=majority
   ```

6. **Create Web Service**:
   - Click "Create Web Service" at the bottom
   - Render will start deploying your app (takes 2-5 minutes)
   - Watch the build logs for any errors

### Step 3: Update RENDER_URL

Once deployment succeeds:

1. **Copy Your App URL**:
   - Find your app URL at the top (e.g., `https://expense-tracker-gnw.onrender.com`)

2. **Update Environment Variable**:
   - Go to "Environment" tab in Render dashboard
   - Edit `RENDER_URL` variable
   - Set value to: `https://your-app-name.onrender.com` (your actual URL)
   - Click "Save Changes"
   - Render will automatically redeploy with the new variable

### Step 4: Test Your Deployed App

1. Visit your Render URL: `https://your-app-name.onrender.com/expenses`

2. Test these features:
   - ✅ Homepage loads with transactions page
   - ✅ Can add new expense
   - ✅ Can edit expense
   - ✅ Can delete expense
   - ✅ Analytics page shows charts
   - ✅ Date range selector works
   - ✅ Bottom navigation works

---

## Part 3: Install PWA on Your Phone

### On Android (Chrome):

1. **Open your Render URL** in Chrome browser

2. **Install the app**:
   - Tap the menu (3 dots) → "Install app" or "Add to Home Screen"
   - Or look for the install prompt banner at the bottom
   - Tap "Install"

3. **Launch from home screen**:
   - Find "Expense Tracker" icon on your home screen
   - Tap to open in standalone mode (no browser UI!)

### On iOS (Safari):

1. **Open your Render URL** in Safari browser

2. **Install the app**:
   - Tap the Share button (box with arrow)
   - Scroll down and tap "Add to Home Screen"
   - Edit name if desired → tap "Add"

3. **Launch from home screen**:
   - Find "Expense Tracker" icon on your home screen
   - Tap to open in standalone mode

---

## Troubleshooting

### Build Fails on Render

**Error**: `npm install` fails
- **Fix**: Check `package.json` is valid JSON
- **Fix**: Ensure all dependencies are listed in `dependencies` (not `devDependencies`)

**Error**: Application failed to respond
- **Fix**: Ensure `index.js` uses `process.env.PORT`
- **Fix**: Check start command is `npm start`

### MongoDB Connection Fails

**Error**: `MongoServerError: bad auth`
- **Fix**: Double-check username and password in connection string
- **Fix**: Ensure password doesn't contain special characters (or URL-encode them)

**Error**: `ECONNREFUSED` or timeout
- **Fix**: Add `0.0.0.0/0` to IP whitelist in MongoDB Atlas Network Access
- **Fix**: Wait 2 minutes after whitelisting for changes to take effect

**Error**: `MongooseServerSelectionError`
- **Fix**: Verify connection string format
- **Fix**: Ensure database name is included in connection string

### PWA Install Not Showing

**Issue**: "Add to Home Screen" not appearing
- **Fix**: Must access via HTTPS (Render provides this automatically)
- **Fix**: Clear browser cache and reload
- **Fix**: On iOS, must use Safari browser (not Chrome)

### App Shows Blank Page

**Issue**: White screen after deployment
- **Fix**: Check Render logs for JavaScript errors
- **Fix**: Ensure `baseURL` is set correctly in environment variables
- **Fix**: Verify all view files have correct `<%= baseURL %>` template tags

---

## Free Tier Limitations

### Render.com Free Tier:
- ✅ 750 hours/month (sufficient for personal use)
- ⚠️  Spins down after 15 minutes of inactivity
- ⚠️  First request after spin-down takes 30-60 seconds
- ✅ Custom domain supported (optional)

### MongoDB Atlas Free Tier:
- ✅ 512 MB storage (sufficient for thousands of expenses)
- ✅ Unlimited connections
- ✅ Automatic backups

### Workarounds for Spin-Down:
- Use a service like UptimeRobot to ping your app every 5-10 minutes (free)
- Or accept the initial cold start delay when opening the app

---

## Next Steps After Deployment

1. **Bookmark your app URL** for easy access

2. **Install PWA on your phone** (see Part 3 above)

3. **Optional: Set up custom domain**:
   - In Render dashboard → "Settings" → "Custom Domain"
   - Add your domain and follow DNS instructions

4. **Optional: Complete Phase 7** for additional polish:
   - Loading states
   - Form validation
   - Toast notifications
   - Smooth animations

---

## Updating Your Deployed App

When you make changes to the code:

1. **Commit and push** to your branch:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```

2. **Auto-deploy**: Render automatically detects the push and redeploys

3. **Manual deploy**: Or click "Manual Deploy" → "Deploy latest commit" in Render dashboard

---

## Security Notes

### For Production Use:

1. **Whitelist specific IPs** in MongoDB Atlas instead of `0.0.0.0/0`

2. **Add authentication** (currently single-user, no login required)

3. **Use environment-specific configs**:
   - Development: `localhost:3000`
   - Production: Your Render URL

4. **Rotate MongoDB password** regularly

5. **Enable MongoDB encryption at rest** (available in Atlas)

---

## Support

If you encounter issues:

1. **Check Render logs**: Dashboard → "Logs" tab
2. **Check MongoDB Atlas metrics**: Cluster → "Metrics" tab
3. **Verify environment variables**: Render Dashboard → "Environment" tab

**Common gotchas**:
- URL-encode special characters in MongoDB password
- Must use HTTPS for PWA installation
- Service worker only works on HTTPS (Render provides this)
- First load after deployment may take 30-60 seconds (free tier cold start)

---

## Estimated Setup Time

- MongoDB Atlas setup: **5 minutes**
- Render deployment: **10 minutes**
- PWA installation on phone: **2 minutes**

**Total: ~20 minutes** from start to using the app on your phone!

---

*Last updated: Phase 6 completion - PWA fully functional*
