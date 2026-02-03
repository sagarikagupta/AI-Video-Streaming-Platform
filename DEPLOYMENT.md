# Deployment Guide - Vercel + Railway (FREE)

## Prerequisites
- GitHub account
- Vercel account (sign up with GitHub)
- Railway account (sign up with GitHub)
- Supabase account (already set up ✅)

## Step 1: Push to GitHub

```bash
# In project root
cd "c:\Users\Sagarika Gupta\Desktop\AI-Video-Streaming-Platform"

git init
git add .
git commit -m "Initial commit - Iris streaming platform"

# Create new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/iris-streaming.git
git push -u origin main
```

## Step 2: Deploy Go Server to Railway

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `iris-streaming` repository
5. Railway will detect the `server` folder
6. Click **"Add variables"** and add:
   - `PORT` = `8080`
7. Click **"Deploy"**
8. Wait for deployment (2-3 minutes)
9. Copy the **public URL** (e.g., `https://iris-go.up.railway.app`)
10. **Important**: Change `https://` to `wss://` and add `/signal`
    - Final URL: `wss://iris-go.up.railway.app/signal`

## Step 3: Deploy Python AI Server to Railway

1. In Railway, click **"New"** → **"GitHub Repo"**
2. Select same repository
3. Railway detects `server-ai` folder
4. Add environment variables:
   - `PORT` = `8000`
   - `OPENAI_API_KEY` = your OpenAI key (if using)
5. Click **"Deploy"**
6. Copy the **public URL** (e.g., `https://iris-ai.up.railway.app`)

## Step 4: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel auto-detects Next.js in `client` folder
5. **Root Directory**: Set to `client`
6. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   NEXT_PUBLIC_WEBSOCKET_URL=wss://iris-go.up.railway.app/signal
   NEXT_PUBLIC_AI_API_URL=https://iris-ai.up.railway.app
   ```
7. Click **"Deploy"**
8. Wait 2-3 minutes
9. Your app is live! (e.g., `https://iris-streaming.vercel.app`)

## Step 5: Test Everything

1. Visit your Vercel URL
2. Sign up with a real email
3. Go to `/create` page
4. Click "Start Stream"
5. Allow camera/microphone
6. Stream should start!

## Troubleshooting

**WebSocket connection fails**:
- Check Railway Go server logs
- Verify `NEXT_PUBLIC_WEBSOCKET_URL` is correct
- Make sure it starts with `wss://` not `https://`

**Camera not working**:
- HTTPS is required for camera access
- Vercel provides this automatically
- Check browser permissions

**Services sleeping**:
- Railway free tier sleeps after 30min
- First request wakes it up (takes 10-20 seconds)
- Upgrade to prevent sleeping

## Free Tier Limits

**Railway**: $5 credit/month
- ~500 hours uptime
- Good for 2 services
- Services sleep after inactivity

**Vercel**: 
- 100GB bandwidth/month
- Unlimited deployments

**Supabase**:
- 500MB database
- 50k monthly users

## Cost to Scale

When you outgrow free tier:
- Railway: $5/month per service
- Total: ~$10/month for unlimited uptime

## Next Steps

After deployment:
1. ✅ Share your Vercel URL
2. ✅ Test with friends
3. ✅ Monitor Railway usage
4. ✅ Add custom domain (optional)

Your streaming platform is now live! 🚀
