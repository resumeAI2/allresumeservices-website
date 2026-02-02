# Pre-Deployment Checklist

**Quick Reference Guide for Production Deployment**

---

## 🔴 CRITICAL - Must Complete Before Deployment

### 1. Database Password Rotation
- [ ] Update `DATABASE_URL` in Vercel with new password
- [ ] Test database connection: `pnpm db:push`
- [ ] Delete `PASSWORD_ROTATION_CHECKLIST.md` after completion

### 2. Environment Variables in Vercel
Go to Vercel → Project → Settings → Environment Variables

**Required Variables:**
- [ ] `DATABASE_URL` (with NEW password)
- [ ] `JWT_SECRET`
- [ ] `VITE_APP_ID`
- [ ] `OAUTH_SERVER_URL`
- [ ] `OWNER_OPEN_ID`
- [ ] `NODE_ENV=production`
- [ ] `EMAIL_USER`
- [ ] `SMTP_PASSWORD`
- [ ] `EMAIL_HOST`
- [ ] `EMAIL_PORT`
- [ ] `ADMIN_NOTIFICATION_EMAIL`
- [ ] `PAYPAL_CLIENT_ID`
- [ ] `PAYPAL_CLIENT_SECRET`
- [ ] `PAYPAL_MODE=live`

**Recommended Variables:**
- [ ] `CRON_SECRET` (generate with: `openssl rand -base64 32`)
- [ ] `SENTRY_DSN`
- [ ] `VITE_SENTRY_DSN`

### 3. Build & Test
```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build for production
pnpm build

# Verify build output exists
ls dist/public
```

### 4. Security Verification
```bash
# Verify no .env files are tracked
git ls-files | grep .env
# Should return nothing

# Verify no passwords in tracked files
git grep -i "password" -- "*.ts" "*.tsx" "*.js" "*.jsx"
# Should only show environment variable references
```

---

## 🟡 HIGH PRIORITY - Complete Before Heavy Traffic

### 5. Rate Limiting
- [ ] Implement rate limiting for:
  - Contact form (`/api/trpc/contact.submit`)
  - Payment endpoints (`/api/trpc/payment.*`)
  - File uploads (`/api/trpc/intakeFileUpload.*`)
  - Review requests
- [ ] Consider Vercel Pro plan for built-in rate limiting

### 6. HTML Sanitization
```bash
# Install DOMPurify
pnpm add dompurify
pnpm add -D @types/dompurify
```
- [ ] Update `client/src/components/BlogContent.tsx` to sanitize HTML
- [ ] Test blog post rendering

### 7. CORS Configuration
- [ ] Review `vercel.json` CORS settings
- [ ] Restrict `Access-Control-Allow-Origin` if needed
- [ ] Test API calls from production domain

---

## 🟢 RECOMMENDED - Post-Deployment

### 8. Manual Testing After Deployment
- [ ] Homepage loads correctly
- [ ] Contact form submission works
- [ ] Email delivery verified
- [ ] Admin login works
- [ ] Blog posts display correctly
- [ ] Payment flow (test mode first)
- [ ] File uploads work
- [ ] Sitemap accessible: `/sitemap.xml`
- [ ] Robots.txt accessible: `/robots.txt`

### 9. Monitoring Setup
- [ ] Verify Sentry is receiving events
- [ ] Check Vercel function logs
- [ ] Monitor database performance
- [ ] Set up uptime monitoring (optional)
- [ ] Enable Vercel Analytics (optional)

### 10. Cron Jobs Verification
- [ ] Verify cron jobs are configured in Vercel
- [ ] Test backup endpoint: `/api/cron/backup?secret=YOUR_CRON_SECRET`
- [ ] Test review request endpoint: `/api/cron/review-requests?secret=YOUR_CRON_SECRET`
- [ ] Check cron logs in Vercel dashboard

---

## 📋 Quick Commands Reference

### Local Development
```bash
# Start development server
pnpm dev

# Run database migrations
pnpm db:push

# Generate database types
pnpm db:generate

# Open database studio
pnpm db:studio
```

### Testing
```bash
# Run all tests
pnpm test

# Type checking
pnpm check

# Format code
pnpm format
```

### Deployment
```bash
# Build for production
pnpm build

# Start production server (local test)
pnpm start
```

### Database
```bash
# Test database connection
pnpm db:get-connection

# Push schema changes
pnpm db:push

# Run migrations
pnpm db:migrate
```

---

## 🚨 Emergency Rollback Procedure

If something goes wrong after deployment:

1. **Revert in Vercel:**
   - Go to Vercel Dashboard → Deployments
   - Find last working deployment
   - Click "..." → "Promote to Production"

2. **Database Issues:**
   - Check connection string in Vercel env vars
   - Verify database is accessible from Vercel IPs
   - Check Neon dashboard for database status

3. **Environment Variable Issues:**
   - Double-check all required variables are set
   - Verify no typos in variable names
   - Redeploy after fixing

---

## 📞 Support Resources

### Platform Documentation
- **Vercel:** https://vercel.com/docs
- **Neon Database:** https://neon.tech/docs
- **tRPC:** https://trpc.io/docs
- **Drizzle ORM:** https://orm.drizzle.team/docs

### Monitoring
- **Sentry Dashboard:** https://sentry.io/
- **Vercel Logs:** Vercel Dashboard → Project → Logs
- **Database Logs:** Neon Dashboard → Project → Logs

### Payment & Email
- **PayPal Developer:** https://developer.paypal.com/
- **ProtonMail Support:** https://proton.me/support

---

## ✅ Final Pre-Deployment Sign-Off

Before clicking "Deploy":

- [ ] All critical items completed
- [ ] All tests passing
- [ ] Build succeeds locally
- [ ] Environment variables set in Vercel
- [ ] Database password rotated
- [ ] Team notified of deployment
- [ ] Monitoring tools ready
- [ ] Rollback plan understood

**Deployed By:** ________________  
**Date:** ________________  
**Time:** ________________  
**Deployment URL:** ________________

---

## 📊 Post-Deployment Monitoring (First 24 Hours)

### Hour 1
- [ ] Verify deployment successful
- [ ] Check all pages load
- [ ] Test critical user flows
- [ ] Monitor error logs

### Hour 4
- [ ] Check Sentry for errors
- [ ] Verify email delivery
- [ ] Monitor database performance
- [ ] Check function execution times

### Hour 12
- [ ] Review all error logs
- [ ] Check cron job execution
- [ ] Monitor traffic patterns
- [ ] Verify backup ran successfully

### Hour 24
- [ ] Generate deployment report
- [ ] Document any issues encountered
- [ ] Plan optimization tasks
- [ ] Schedule follow-up review

---

**Last Updated:** January 26, 2026  
**Version:** 1.0  
**Next Review:** After deployment
