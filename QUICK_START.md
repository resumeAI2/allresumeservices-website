# 🚀 Quick Start - NextAuth.js Setup

## ⚡ 3-Minute Setup

### Step 1: Generate AUTH_SECRET (30 seconds)

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output, then:

```bash
# Local
echo "AUTH_SECRET=<paste_here>" >> .env
echo "ADMIN_EMAIL=your-email@allresumeservices.com" >> .env

# Vercel
vercel env add AUTH_SECRET production
# Paste the secret

vercel env add ADMIN_EMAIL production
# Enter: your-email@allresumeservices.com
```

---

### Step 2: Run Database Migration (1 minute)

```bash
pnpm db:generate
pnpm db:push
```

---

### Step 3: Test Locally (1 minute)

```bash
pnpm dev
```

- **Home page preview:** http://localhost:3000/  
- **Admin login:** http://localhost:3000/login  

In Cursor/VS Code: **Terminal → Run Task → Preview Home Page** opens the home page in your browser (with the dev server running).

1. Click "Sign Up" tab
2. Enter your details
3. Create account
4. You should be logged in!

---

### Step 4: Deploy to Production (30 seconds)

```bash
git add .
git commit -m "feat: add NextAuth.js authentication"
git push origin main
```

Vercel will auto-deploy. Visit your site and test login!

---

## 🎯 That's It!

Your authentication is now set up. Users can:
- ✅ Sign up with email/password
- ✅ Log in securely
- ✅ Your admin email gets admin role automatically

---

## 🔧 Optional: Add Social Login

### Google (5 minutes)

1. Go to: https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Redirect URI: `https://your-domain.com/api/auth/callback/google`
4. Copy Client ID and Secret

```bash
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
```

### GitHub (5 minutes)

1. Go to: https://github.com/settings/developers
2. New OAuth App
3. Callback URL: `https://your-domain.com/api/auth/callback/github`
4. Copy Client ID and Secret

```bash
vercel env add GITHUB_CLIENT_ID production
vercel env add GITHUB_CLIENT_SECRET production
```

---

## 📚 Need More Info?

- **Full Setup Guide:** `NEXTAUTH_SETUP_GUIDE.md`
- **Migration Details:** `NEXTAUTH_MIGRATION_COMPLETE.md`

---

## 🆘 Quick Troubleshooting

**Login not working?**
- Check `AUTH_SECRET` is set
- Verify database migration ran successfully
- Check browser console for errors

**Admin role not assigned?**
- Verify `ADMIN_EMAIL` matches your email exactly
- Log out and log back in

**Social login not working?**
- Check OAuth credentials are set
- Verify redirect URIs match exactly

---

**✨ Enjoy your new authentication system!**
