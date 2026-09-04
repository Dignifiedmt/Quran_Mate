# Deploying Quran Mate 🌙 to Render

This full-stack application (Express + React Vite + SQLite/sql.js) is pre-configured for seamless zero-downtime deployment to [Render](https://render.com).

---

## 🚀 Option 1: Automatic Blueprint Deployment (Fastest)

1. Push this repository to your **GitHub** or **GitLab** account.
2. Go to your [Render Dashboard](https://dashboard.render.com).
3. Click **"New +"** and select **"Blueprint"**.
4. Connect your Quran Mate repository.
5. Render will automatically detect `render.yaml` and configure the service:
   - **Service Name**: `quran-mate`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Click **"Apply"** to deploy. Render will provision your app with free automatic HTTPS/SSL!

---

## 🛠 Option 2: Manual Web Service Setup

If you prefer setting up the Web Service manually:

1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **"New +"** → **"Web Service"**.
3. Select **"Build and deploy from a Git repository"** and connect your repo.
4. Fill in the following fields:
   - **Name**: `quran-mate` (or your preferred name)
   - **Region**: Choose the closest region to you (e.g., Oregon, Frankfurt, Singapore)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. **Environment Variables**:
   Under the **Environment Variables** section, add:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = *(Generate a secure random string or leave default)*
   *(Note: Render automatically supplies `PORT`, which our server dynamically uses).*
6. Click **"Create Web Service"**. Render will build your app and deploy it to `https://your-app-name.onrender.com`.

---

## 💾 Optional: Persistent Storage for SQLite

Quran Mate stores learner profiles, tracker streaks, and partnerships in SQLite.

- **On Free Tier**: The database persists in container memory and local disk between standard restarts, but Render's free tier resets the filesystem when the instance sleeps or rebuilds.
- **To make SQLite 100% permanent across all rebuilds**:
  1. Upgrade to a paid plan ($7/mo) or attach a **Persistent Disk**.
  2. On your Render Web Service settings, go to **Disks** → **Add Disk**.
     - **Name**: `quran-mate-storage`
     - **Mount Path**: `/var/data`
     - **Size**: 1 GB
  3. Add an Environment Variable:
     - `SQLITE_PATH` = `/var/data/quran_mate.sqlite`
  4. Now all partner sessions, streaks, and progress records will permanently stay intact across all redeployments!

---

## 🔍 Verification & Health Check

Once deployed, visit your live Render URL:
- Home: `https://your-app-name.onrender.com/`
- Dashboard: `https://your-app-name.onrender.com/dashboard`
- API Health Check: `https://your-app-name.onrender.com/api/learners`
