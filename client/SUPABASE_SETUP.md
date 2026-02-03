# Supabase Authentication Setup Guide

## Step 1: Add Your API Keys

Open the file: `client/.env.local`

Replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Where to find these:**
1. Go to your Supabase project dashboard
2. Click **Project Settings** (gear icon)
3. Go to **API** section
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 2: Restart Dev Server

After adding your keys:

```bash
# Stop the current dev server (Ctrl+C)
# Then restart it:
npm run dev
```

## Step 3: Test Authentication

1. Go to `http://localhost:3000/auth`
2. Click **Sign Up** tab
3. Enter:
   - Name: Your name
   - Email: A real email address
   - Password: At least 6 characters
4. Click **Sign Up**

**What happens:**
- ✅ Account created in Supabase
- ✅ Automatically logged in
- ✅ Redirected to home page
- ✅ Session persists across page refreshes

## Step 4: Verify in Supabase

1. Go to your Supabase dashboard
2. Click **Authentication** → **Users**
3. You should see your new user account!

## Features Now Working

✅ **Real user accounts** - Stored in Supabase database
✅ **Secure passwords** - Hashed automatically
✅ **Session management** - Stay logged in
✅ **Email validation** - Must be valid email format
✅ **Password requirements** - Minimum 6 characters
✅ **Error messages** - Shows real validation errors
✅ **Logout** - Click profile → Logout

## Optional: Enable Email Verification

By default, users can sign up without email verification. To require it:

1. Go to Supabase dashboard
2. **Authentication** → **Settings**
3. Find **Email Auth**
4. Toggle **Enable email confirmations**
5. Users will need to verify email before logging in

## Troubleshooting

**Error: "Invalid API key"**
- Check that you copied the full anon key
- Make sure there are no extra spaces
- Restart dev server after adding keys

**Error: "Invalid login credentials"**
- Make sure you signed up first
- Check email/password are correct
- Passwords are case-sensitive

**Not staying logged in?**
- Check browser console for errors
- Make sure cookies are enabled
- Try clearing browser cache

## What's Stored in Supabase

Your Supabase database now stores:
- User ID (UUID)
- Email address
- Encrypted password (you can't see it)
- User metadata (name)
- Created date
- Last sign-in date

All data is secure and encrypted! 🔒
