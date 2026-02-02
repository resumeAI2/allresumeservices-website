# Vercel Deployment Preparation Checklist

This checklist covers everything you need to do before publishing your site on Vercel.

## ✅ Already Configured

- [x] `vercel.json` configuration file exists
- [x] `api/index.ts` serverless function handler is set up
- [x] Build scripts are configured in `package.json`
- [x] Project structure is compatible with Vercel

## 🔴 Critical: Must Complete Before Deployment

### 1. Environment Variables Setup

Go to your Vercel project → Settings → Environment Variables and add ALL of these:

#### Core Application (Required)
```
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require&channel_binding=require
JWT_SECRET=your_jwt_secret_key_here
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
OWNER_OPEN_ID=your_open_id
```

#### Frontend Configuration (Required)
```
VITE_APP_TITLE=All Resume Services
VITE_APP_LOGO=/logo.svg
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your_website_id
```

#### AWS S3 Storage (Required if using file uploads)
```
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your_bucket_name
```

#### Email Service - Amazon SES (Required)
```
SES_FROM_EMAIL=admin@allresumeservices.com.au
```

#### PayPal Integration (Required if using payments)
```
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=live
```

#### Optional Services
```
BUILT_IN_FORGE_API_URL=...
BUILT_IN_FORGE_API_KEY=...
SENTRY_DSN=your_sentry_dsn (optional but recommended)
VITE_SENTRY_DSN=your_sentry_dsn (optional but recommended)
CRON_SECRET=your_random_secret_string (recommended for cron security)
```

**⚠️ Important:**
- Set these for **Production**, **Preview**, and **Development** environments as needed
- Never commit actual values to git
- Use Vercel's environment variable encryption

### 2. Database Setup

- [ ] **Neon Database is created and accessible**
- [ ] **Connection string is correct** (should use pooler endpoint for better performance)
- [ ] **Run database migrations** before first deployment:
  ```bash
  pnpm db:push
  ```
- [ ] **Verify database connection** works from your local machine

### 3. Cron Jobs Setup

The project has two cron jobs that need to be configured for Vercel:

#### Option A: Use Vercel Cron (Recommended)
- [x] Cron API endpoints have been created at:
  - `/api/cron/backup` - Database backup (runs daily at 2:00 AM)
  - `/api/cron/review-requests` - Review request emails (runs daily at 9:00 AM)
- [x] **Cron configuration added to `vercel.json`** ✅
- [ ] **Set `CRON_SECRET` environment variable** in Vercel for security (recommended)

#### Option B: Use External Cron Service
- [ ] Set up [cron-job.org](https://cron-job.org) or similar
- [ ] Configure to call:
  - `https://your-domain.vercel.app/api/cron/backup` (daily at 2:00 AM)
  - `https://your-domain.vercel.app/api/cron/review-requests` (daily at 9:00 AM)
- [ ] Add authentication header: `Authorization: Bearer YOUR_CRON_SECRET`

### 4. GitHub Repository

- [ ] **Code is pushed to GitHub** (Vercel works best with GitHub integration)
- [ ] **Repository is accessible** to your Vercel account
- [ ] **`.env` files are in `.gitignore`** (already done ✅)

### 5. Build Configuration

- [x] `vercel.json` is configured correctly
- [x] Build command: `pnpm build`
- [x] Output directory: `dist/public`
- [x] Install command: `pnpm install`
- [ ] **Test build locally** to ensure it works:
  ```bash
  pnpm install
  pnpm build
  ```

### 6. Domain Configuration (Optional but Recommended)

- [ ] **Custom domain is ready** (e.g., `allresumeservices.com.au`)
- [ ] **DNS records are configured** (will be provided by Vercel)
- [ ] **SSL certificate** will be auto-provisioned by Vercel

## 🟡 Recommended: Before Going Live

### 7. Error Monitoring

- [ ] **Set up Sentry account** (if not already done)
- [ ] **Add `SENTRY_DSN` and `VITE_SENTRY_DSN`** environment variables
- [ ] **Test error tracking** works in production

### 8. Testing

- [ ] **Test all API endpoints** after deployment
- [ ] **Test authentication flow** (OAuth)
- [ ] **Test file uploads** (if applicable)
- [ ] **Test payment processing** (if applicable)
- [ ] **Test email sending** (contact forms, etc.)
- [ ] **Test database operations** (CRUD operations)

### 9. Performance

- [ ] **Enable Vercel Analytics** in project settings
- [ ] **Check function logs** for any errors
- [ ] **Monitor function execution time** (should be under 30s)
- [ ] **Optimize large assets** if needed

### 10. Security

- [ ] **Review CORS settings** in `vercel.json` (currently set to `*` - consider restricting)
- [ ] **Set up rate limiting** if needed (Vercel Pro plan)
- [ ] **Review environment variable access** (who can see them)
- [ ] **Enable Vercel's DDoS protection** (automatic on Pro plan)

## 📋 Deployment Steps

1. **Connect Repository to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect configuration

2. **Configure Environment Variables:**
   - Add all required variables from section 1 above
   - Set for Production, Preview, and Development

3. **Deploy:**
   - Click "Deploy" (first deployment)
   - Or push to main branch (auto-deploys)

4. **Verify Deployment:**
   - Check build logs for errors
   - Test the live site
   - Check function logs

5. **Set Up Cron Jobs:**
   - Add cron configuration to `vercel.json` (if using Vercel Cron)
   - Or configure external cron service

6. **Configure Custom Domain:**
   - Add domain in Vercel project settings
   - Update DNS records as instructed
   - Wait for SSL certificate provisioning

## 🚨 Common Issues & Solutions

### Build Fails
- **Check:** All environment variables are set
- **Check:** `DATABASE_URL` is correct and accessible
- **Check:** Build logs in Vercel dashboard
- **Check:** Node.js version compatibility

### API Routes Return 500
- **Check:** Function logs in Vercel dashboard
- **Check:** Environment variables are set correctly
- **Check:** Database connection is working
- **Check:** `@vercel/node` is installed (already in devDependencies ✅)

### Static Files Not Loading
- **Check:** `outputDirectory` in `vercel.json` matches build output
- **Check:** Files exist in `dist/public/` after build
- **Check:** Rewrite rules in `vercel.json` are correct

### Database Connection Issues
- **Check:** `DATABASE_URL` format is correct
- **Check:** Using Neon pooler endpoint (contains `-pooler` in hostname)
- **Check:** SSL mode is `require` in connection string
- **Check:** Database is accessible from Vercel's IP ranges

### Cron Jobs Not Running
- **Check:** Cron configuration in `vercel.json` is correct
- **Check:** API endpoints exist and are accessible
- **Check:** `CRON_SECRET` is set if using authentication
- **Check:** Vercel Cron logs in dashboard

## 📝 Post-Deployment Checklist

- [ ] All pages load correctly
- [ ] API endpoints respond correctly
- [ ] Database operations work
- [ ] Authentication works
- [ ] File uploads work (if applicable)
- [ ] Payments work (if applicable)
- [ ] Emails are sending correctly
- [ ] Cron jobs are running (check logs)
- [ ] Error tracking is working (Sentry)
- [ ] Analytics are tracking (if enabled)
- [ ] Custom domain is working (if configured)
- [ ] SSL certificate is active

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Neon Database Docs](https://neon.tech/docs)
- [Sentry Setup](https://docs.sentry.io/)

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check function logs in Vercel dashboard
3. Review this checklist to ensure all steps are completed
4. Check `VERCEL_DEPLOYMENT_GUIDE.md` for detailed instructions
