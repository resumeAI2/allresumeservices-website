# Vercel Environment Variables Setup Guide

**Project:** allresumeservices-website  
**Project ID:** `prj_W4EHCkIYvehYBXGcwimkUbJYhRzq`  
**Team:** Sonia's projects (`team_6lLIhKatdvPnnb7t63rEjHJe`)

---

## 🔴 CRITICAL: Complete These Steps Before Deployment

### Step 1: Access Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Select team: **Sonia's projects**
3. Select project: **allresumeservices-website**
4. Navigate to: **Settings** → **Environment Variables**

---

## 📋 Required Environment Variables

Copy and paste these into Vercel (replace placeholder values with actual credentials):

### Core Application (REQUIRED)

```bash
# Database Connection (CRITICAL - Use NEW password)
DATABASE_URL=postgresql://neondb_owner:[NEW_PASSWORD]@ep-proud-smoke-a78h2pb8-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# JWT Secret for session management
JWT_SECRET=your_jwt_secret_key_here

# Manus OAuth Configuration
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=your_open_id

# Environment
NODE_ENV=production
```

### Email Service (REQUIRED)

```bash
# ProtonMail SMTP Configuration
EMAIL_USER=info@allresumeservices.com
SMTP_PASSWORD=your_protonmail_app_password
EMAIL_HOST=smtp.protonmail.ch
EMAIL_PORT=587

# Admin notification email
ADMIN_NOTIFICATION_EMAIL=admin@allresumeservices.com.au
CONTACT_NOTIFICATION_EMAIL=admin@allresumeservices.com.au
```

### PayPal Integration (REQUIRED for payments)

```bash
# PayPal Credentials
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=live
```

### Security (REQUIRED)

```bash
# Cron Job Protection
# Generate with: openssl rand -base64 32
CRON_SECRET=your_random_secret_string_here
```

### Frontend Configuration (REQUIRED)

```bash
VITE_APP_TITLE=All Resume Services
VITE_APP_LOGO=/logo.svg
```

### Monitoring (RECOMMENDED)

```bash
# Sentry Error Tracking
SENTRY_DSN=your_sentry_dsn_here
VITE_SENTRY_DSN=your_sentry_dsn_here
```

### Storage (OPTIONAL - if using file uploads)

```bash
# Manus Forge API for file storage
BUILT_IN_FORGE_API_URL=your_forge_api_url
BUILT_IN_FORGE_API_KEY=your_forge_api_key

# AWS S3 (alternative storage)
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your_bucket_name
```

### Analytics (OPTIONAL)

```bash
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your_website_id
```

---

## 🔐 Step 2: Generate CRON_SECRET

This is critical for protecting your cron endpoints from unauthorized access.

### Option A: Using OpenSSL (Recommended)

```bash
openssl rand -base64 32
```

### Option B: Using Node.js

```javascript
require('crypto').randomBytes(32).toString('base64')
```

### Option C: Online Generator

Visit: https://generate-secret.vercel.app/32

**Copy the generated secret and add it to Vercel as `CRON_SECRET`**

---

## 🗄️ Step 3: Update DATABASE_URL

### Get Your New Password

The database password was rotated. Get the new connection string from:

1. **Neon Dashboard:** https://console.neon.tech
2. Navigate to your project
3. Go to **Connection Details**
4. Copy the **Pooled connection** string
5. Paste it into Vercel as `DATABASE_URL`

**Format:**
```
postgresql://neondb_owner:[PASSWORD]@[HOST]-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Important:** Use the **pooled connection** (contains `-pooler` in hostname) for better performance.

---

## ⚙️ Step 4: Configure Environment Scope

For each environment variable, select which environments it applies to:

- ✅ **Production** - Always required
- ✅ **Preview** - Recommended for testing
- ⚠️ **Development** - Optional (use local `.env` instead)

**Recommendation:** Set all variables for Production and Preview environments.

---

## 🧪 Step 5: Verify Configuration

After adding all environment variables:

### 5.1 Check Variable Count

You should have at least **15 environment variables** set:

**Core (6):**
- DATABASE_URL
- JWT_SECRET
- VITE_APP_ID
- OAUTH_SERVER_URL
- OWNER_OPEN_ID
- NODE_ENV

**Email (5):**
- EMAIL_USER
- SMTP_PASSWORD
- EMAIL_HOST
- EMAIL_PORT
- ADMIN_NOTIFICATION_EMAIL

**PayPal (3):**
- PAYPAL_CLIENT_ID
- PAYPAL_CLIENT_SECRET
- PAYPAL_MODE

**Security (1):**
- CRON_SECRET

**Frontend (1):**
- VITE_APP_TITLE

**Plus optional:** SENTRY_DSN, VITE_SENTRY_DSN, storage variables, etc.

### 5.2 Test Database Connection

After deployment, test the database connection:

```bash
# From your local machine
curl https://your-vercel-app.vercel.app/api/trpc/health.check
```

Should return:
```json
{
  "status": "healthy",
  "database": {
    "status": "connected",
    "latency": 50
  }
}
```

### 5.3 Test Cron Endpoints

Test that cron endpoints are protected:

```bash
# Without secret (should fail with 401)
curl https://your-vercel-app.vercel.app/api/cron/backup

# With secret (should succeed)
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-vercel-app.vercel.app/api/cron/backup
```

---

## 🚀 Step 6: Deploy

Once all environment variables are set:

### Option A: Automatic Deployment

Push to your main branch:

```bash
git add .
git commit -m "Add security improvements and environment configuration"
git push origin main
```

Vercel will automatically deploy.

### Option B: Manual Deployment

1. Go to Vercel Dashboard → Deployments
2. Click **Deploy** button
3. Select branch: `main`
4. Click **Deploy**

---

## ✅ Post-Deployment Checklist

After deployment completes:

- [ ] Visit your production URL
- [ ] Test homepage loads
- [ ] Test contact form submission
- [ ] Verify email delivery
- [ ] Test admin login
- [ ] Check Sentry for errors
- [ ] Verify cron jobs are scheduled
- [ ] Test database queries work
- [ ] Check Vercel function logs

---

## 🔍 Troubleshooting

### Database Connection Fails

**Symptoms:** Application can't connect to database

**Solutions:**
1. Verify `DATABASE_URL` is correct
2. Check you're using the **pooled connection** string
3. Verify SSL mode is `require`
4. Check Neon database is running
5. Review Vercel function logs for specific error

### Cron Jobs Not Running

**Symptoms:** Backups or review requests not executing

**Solutions:**
1. Verify `CRON_SECRET` is set
2. Check Vercel Cron configuration in dashboard
3. Review cron logs in Vercel
4. Test endpoints manually with secret

### Email Not Sending

**Symptoms:** Contact forms submit but no emails received

**Solutions:**
1. Verify all email environment variables are set
2. Check `SMTP_PASSWORD` is correct (use app-specific password)
3. Test SMTP connection from admin panel
4. Review Vercel function logs
5. Check email logs in database

### Rate Limiting Too Aggressive

**Symptoms:** Legitimate users getting rate limited

**Solutions:**
1. Review rate limit settings in `server/middleware/rateLimit.ts`
2. Adjust limits based on traffic patterns
3. Consider upgrading to Vercel Pro for more control

---

## 📞 Support Resources

### Vercel

- **Dashboard:** https://vercel.com/dashboard
- **Documentation:** https://vercel.com/docs
- **Support:** https://vercel.com/support

### Neon Database

- **Console:** https://console.neon.tech
- **Documentation:** https://neon.tech/docs
- **Support:** https://neon.tech/docs/introduction/support

### Sentry

- **Dashboard:** https://sentry.io/
- **Documentation:** https://docs.sentry.io/

---

## 🔒 Security Best Practices

### DO:
- ✅ Use strong, unique passwords
- ✅ Rotate credentials regularly
- ✅ Use environment variables for all secrets
- ✅ Enable 2FA on Vercel account
- ✅ Monitor logs for suspicious activity
- ✅ Keep dependencies updated

### DON'T:
- ❌ Commit `.env` files to git
- ❌ Share credentials in chat/email
- ❌ Use same password across services
- ❌ Disable security features
- ❌ Ignore security warnings

---

## 📝 Environment Variable Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ Yes | - | PostgreSQL connection string |
| `JWT_SECRET` | ✅ Yes | - | Secret for JWT token signing |
| `VITE_APP_ID` | ✅ Yes | - | Manus application ID |
| `OAUTH_SERVER_URL` | ✅ Yes | `https://api.manus.im` | OAuth server URL |
| `OWNER_OPEN_ID` | ✅ Yes | - | Admin user OpenID |
| `NODE_ENV` | ✅ Yes | `production` | Environment mode |
| `EMAIL_USER` | ✅ Yes | - | SMTP username |
| `SMTP_PASSWORD` | ✅ Yes | - | SMTP password |
| `EMAIL_HOST` | ✅ Yes | `smtp.protonmail.ch` | SMTP server |
| `EMAIL_PORT` | ✅ Yes | `587` | SMTP port |
| `ADMIN_NOTIFICATION_EMAIL` | ✅ Yes | - | Admin email for notifications |
| `PAYPAL_CLIENT_ID` | ✅ Yes | - | PayPal client ID |
| `PAYPAL_CLIENT_SECRET` | ✅ Yes | - | PayPal client secret |
| `PAYPAL_MODE` | ✅ Yes | `live` | PayPal mode (sandbox/live) |
| `CRON_SECRET` | ✅ Yes | - | Secret for cron endpoint protection |
| `VITE_APP_TITLE` | ✅ Yes | `All Resume Services` | Application title |
| `SENTRY_DSN` | ⚠️ Recommended | - | Sentry DSN for server errors |
| `VITE_SENTRY_DSN` | ⚠️ Recommended | - | Sentry DSN for client errors |
| `BUILT_IN_FORGE_API_URL` | ⚪ Optional | - | Forge API URL for storage |
| `BUILT_IN_FORGE_API_KEY` | ⚪ Optional | - | Forge API key |
| `AWS_REGION` | ⚪ Optional | - | AWS region for S3 |
| `AWS_ACCESS_KEY_ID` | ⚪ Optional | - | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | ⚪ Optional | - | AWS secret key |
| `AWS_S3_BUCKET` | ⚪ Optional | - | S3 bucket name |

---

**Last Updated:** January 26, 2026  
**Next Review:** After successful deployment
