# Railway Deployment - Important Instructions

## ⚠️ The Issue

Railway is failing because it's trying to build from the **root directory** instead of the specific service folders (`server-go` or `server-ai`).

## ✅ Solution: Deploy Each Service Separately

You need to tell Railway which folder to deploy. Here's how:

### Option 1: Use Railway CLI (Recommended)

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Deploy Go Server:
   ```bash
   cd server-go
   railway up
   ```

4. Deploy Python AI Server:
   ```bash
   cd ../server-ai
   railway up
   ```

### Option 2: Use Railway Dashboard (Manual Setup)

#### For Go Server:

1. In Railway, click **"New Project"** → **"Empty Project"**
2. Click **"New"** → **"GitHub Repo"**
3. Select your repository
4. **IMPORTANT**: In the deployment settings:
   - Go to **Settings** → **Source**
   - Set **Root Directory** to: `server-go`
   - Set **Build Command**: (leave empty, uses Dockerfile)
   - Set **Start Command**: `./main`
5. Railway will now use the Dockerfile in `server-go`
6. Click **"Deploy"**

#### For Python AI Server:

1. In the same Railway project, click **"New"** → **"GitHub Repo"**
2. Select same repository
3. In deployment settings:
   - Go to **Settings** → **Source**
   - Set **Root Directory** to: `server-ai`
   - Set **Build Command**: (leave empty, uses Dockerfile)
   - Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Click **"Deploy"**

### Option 3: Create Separate Repositories (Easiest)

If the above doesn't work, create separate repos:

1. Create `iris-go-server` repo with just `server-go` contents
2. Create `iris-ai-server` repo with just `server-ai` contents
3. Deploy each separately to Railway

## Why This Happens

Railway tries to auto-detect the project type from the root directory. Since your root has multiple services (client, server-go, server-ai), it gets confused.

## Next Steps

Try **Option 2** first:
1. Delete the failed deployment in Railway
2. Create new deployment with **Root Directory** set to `server-go`
3. Repeat for `server-ai`

This should fix the build error! 🚀
