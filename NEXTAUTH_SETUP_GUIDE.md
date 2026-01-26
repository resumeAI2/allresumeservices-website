# NextAuth.js Authentication Setup Guide

## 🎉 Overview

Your application now uses **NextAuth.js v5** for authentication, replacing the previous Manus OAuth system. This provides:

- ✅ **Email/Password authentication** with bcrypt hashing
- ✅ **Google OAuth** (optional)
- ✅ **GitHub OAuth** (optional)
- ✅ **Automatic admin role assignment** based on email
- ✅ **Secure session management** with JWT
- ✅ **Database-backed user storage** with Drizzle ORM

---

## 📋 Required Environment Variables

### 1. **AUTH_SECRET** (Required)

A secret key for signing JWT tokens. Generate one using:

```bash
openssl rand -hex 32
```

Or in Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then add to your `.env`:

```env
AUTH_SECRET=your_generated_secret_here
```

**For Vercel:**

```bash
vercel env add AUTH_SECRET production
# Paste your generated secret
```

---

### 2. **ADMIN_EMAIL** (Required)

The email address that should automatically receive admin privileges:

```env
ADMIN_EMAIL=your-email@allresumeservices.com
```

**For Vercel:**

```bash
vercel env add ADMIN_EMAIL production
# Enter: your-email@allresumeservices.com
```

---

### 3. **Google OAuth** (Optional)

To enable "Sign in with Google":

**Get credentials:**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Create a new project or select existing
3. Click "Create Credentials" → "OAuth 2.0 Client ID"
4. Application type: "Web application"
5. Authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`
6. Copy the Client ID and Client Secret

**Add to `.env`:**

```env
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**For Vercel:**

```bash
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
```

---

### 4. **GitHub OAuth** (Optional)

To enable "Sign in with GitHub":

**Get credentials:**
1. Go to: https://github.com/settings/developers
2. Click "New OAuth App"
3. Application name: "All Resume Services"
4. Homepage URL: `https://your-domain.com`
5. Authorization callback URL:
   - Development: `http://localhost:3000/api/auth/callback/github`
   - Production: `https://your-domain.com/api/auth/callback/github`
6. Copy the Client ID and generate a Client Secret

**Add to `.env`:**

```env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

**For Vercel:**

```bash
vercel env add GITHUB_CLIENT_ID production
vercel env add GITHUB_CLIENT_SECRET production
```

---

## 🗄️ Database Migration

Your database schema has been updated to support NextAuth.js. Run the migration:

```bash
# Generate migration
pnpm db:generate

# Apply migration to database
pnpm db:push
```

**New tables created:**
- `accounts` - OAuth provider connections
- `sessions` - Active user sessions
- `verification_tokens` - Email verification and password reset

**Updated tables:**
- `users` - Added `password`, `emailVerified`, `image` fields
- `users` - Made `openId` optional (legacy Manus field)

---

## 🚀 Usage

### For Users

**Sign Up:**
1. Go to `/login`
2. Click "Sign Up" tab
3. Enter name, email, and password
4. Or click "Google" / "GitHub" for social login

**Sign In:**
1. Go to `/login`
2. Enter email and password
3. Or use Google / GitHub

**Sign Out:**
- Click your profile menu and select "Logout"

---

### For Developers

**Check if user is authenticated:**

```typescript
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  return <div>Welcome, {user.name}!</div>;
}
```

**Require authentication:**

```typescript
import { useAuth } from "@/hooks/useAuth";

function ProtectedPage() {
  // Automatically redirects to /login if not authenticated
  const { user } = useAuth({ redirectOnUnauthenticated: true });

  return <div>Protected content for {user?.name}</div>;
}
```

**Check admin role:**

```typescript
const { user } = useAuth();

if (user?.role === "admin") {
  // Show admin features
}
```

**Server-side authentication (tRPC):**

```typescript
import { protectedProcedure } from "./_core/trpc";

// Requires authentication
const myProcedure = protectedProcedure
  .query(async ({ ctx }) => {
    // ctx.user is guaranteed to exist
    return { userId: ctx.user.id };
  });
```

---

## 🔐 Security Features

### Password Security
- Passwords are hashed with **bcrypt** (10 rounds)
- Minimum 8 characters required
- Never stored in plain text

### Session Security
- JWT tokens signed with `AUTH_SECRET`
- 30-day expiration
- HTTP-only cookies
- Secure flag in production

### Rate Limiting
- Auth routes limited to 10 requests per 15 minutes per IP
- Prevents brute force attacks

### Admin Protection
- Only the email specified in `ADMIN_EMAIL` gets admin role
- Role cannot be changed via API

---

## 🧪 Testing

### Test Email/Password Login

1. Create a test account:
   ```bash
   curl -X POST http://localhost:3000/api/trpc/auth.signup \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

2. Log in:
   - Go to `http://localhost:3000/login`
   - Enter `test@example.com` / `password123`

### Test Admin Access

1. Sign up with the email from `ADMIN_EMAIL`
2. Check user role in database or via API:
   ```bash
   curl http://localhost:3000/api/trpc/auth.me
   ```
3. Should return `role: "admin"`

---

## 🔄 Migration from Manus

### What Changed

**Removed:**
- ❌ `VITE_APP_ID` - No longer needed
- ❌ `OAUTH_SERVER_URL` - No longer needed
- ❌ `VITE_OAUTH_PORTAL_URL` - No longer needed
- ❌ `OWNER_OPEN_ID` - Replaced with `ADMIN_EMAIL`
- ❌ Manus OAuth routes (`/api/oauth/*`)
- ❌ `ManusDialog` component

**Added:**
- ✅ `AUTH_SECRET` - JWT signing key
- ✅ `ADMIN_EMAIL` - Admin role assignment
- ✅ `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (optional)
- ✅ `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` (optional)
- ✅ NextAuth routes (`/api/auth/*`)
- ✅ `/login` page with email/password and social login

### Existing Users

Users who previously logged in with Manus OAuth will need to:

1. **Option A:** Sign up again with email/password
2. **Option B:** Use social login (Google/GitHub) with the same email
   - NextAuth will link to existing account if email matches

---

## 📚 API Routes

NextAuth.js provides these routes automatically:

- `GET /api/auth/signin` - Sign in page
- `POST /api/auth/signin/:provider` - Sign in with provider
- `GET /api/auth/signout` - Sign out
- `POST /api/auth/signout` - Sign out (POST)
- `GET /api/auth/session` - Get current session
- `GET /api/auth/csrf` - Get CSRF token
- `GET /api/auth/providers` - List available providers
- `GET /api/auth/callback/:provider` - OAuth callback

---

## 🐛 Troubleshooting

### "AUTH_SECRET is not set"

**Problem:** Missing `AUTH_SECRET` environment variable

**Solution:**
```bash
# Generate a secret
openssl rand -hex 32

# Add to .env
echo "AUTH_SECRET=your_generated_secret" >> .env

# Restart server
pnpm dev
```

---

### "Invalid credentials" on login

**Problem:** Wrong email or password

**Solution:**
- Check email is correct (case-sensitive)
- Ensure password is at least 8 characters
- Try resetting password (if implemented)
- Check database for user: `SELECT * FROM users WHERE email = 'user@example.com'`

---

### Google/GitHub OAuth not working

**Problem:** OAuth credentials not configured or incorrect redirect URI

**Solution:**
1. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
2. Check redirect URI in Google/GitHub console matches:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://your-domain.com/api/auth/callback/google` (prod)
3. Ensure OAuth app is enabled in console

---

### Admin role not assigned

**Problem:** User doesn't have admin role despite matching `ADMIN_EMAIL`

**Solution:**
1. Check `ADMIN_EMAIL` is set correctly in `.env`
2. Verify email matches exactly (case-sensitive)
3. Log out and log back in
4. Check database: `SELECT role FROM users WHERE email = 'admin@example.com'`
5. Manually update if needed: `UPDATE users SET role = 'admin' WHERE email = 'admin@example.com'`

---

## 📖 Additional Resources

- **NextAuth.js Docs:** https://next-auth.js.org
- **Drizzle ORM:** https://orm.drizzle.team
- **bcrypt:** https://github.com/kelektiv/node.bcrypt.js

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Set `AUTH_SECRET` in Vercel
- [ ] Set `ADMIN_EMAIL` in Vercel
- [ ] (Optional) Configure Google OAuth with production redirect URI
- [ ] (Optional) Configure GitHub OAuth with production redirect URI
- [ ] Run database migration: `pnpm db:push`
- [ ] Test login with email/password
- [ ] Test social login (if enabled)
- [ ] Verify admin role assignment
- [ ] Test logout functionality
- [ ] Remove any old Manus-related environment variables

---

**🎉 You're all set! Your application now has a secure, modern authentication system powered by NextAuth.js.**
