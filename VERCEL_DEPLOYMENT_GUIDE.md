# Vercel Deployment Guide

## Overview

This guide will help you deploy the All Resume Services website to Vercel. The project has been configured to work with Vercel's serverless functions architecture.

## Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository** - Your code should be in a GitHub repository
3. **Neon PostgreSQL Database** - The project uses Neon for PostgreSQL:
   - [Neon](https://neon.tech) - Serverless PostgreSQL (already configured)
   - Connection string format: `postgresql://user:password@host:port/database?sslmode=require`

## Step 1: Prepare Your Database

1. **Neon Database** - Your Neon database is already set up
2. **Connection String** - Use your Neon connection string from the Neon dashboard:
   ```
   postgresql://user:password@host:port/database?sslmode=require&channel_binding=require
   ```
   **⚠️ Never commit your actual connection string to git!**
3. **Run Migrations**:
   ```bash
   pnpm db:push
   ```
   This will create all necessary tables in your Neon database.

## Step 2: Set Up Environment Variables in Vercel

Go to your Vercel project settings → Environment Variables and add:

### Core Application
```
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require&channel_binding=require
JWT_SECRET=your_jwt_secret_key_here
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
OWNER_OPEN_ID=your_open_id
```

### Frontend Configuration
```
VITE_APP_TITLE=All Resume Services
VITE_APP_LOGO=/logo.svg
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your_website_id
```

### AWS S3 Storage
```
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your_bucket_name
```

### Email Service (Amazon SES)
```
SES_FROM_EMAIL=admin@allresumeservices.com.au
```

### PayPal Integration
```
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=live
```

### Optional
```
BUILT_IN_FORGE_API_URL=...
BUILT_IN_FORGE_API_KEY=...
```

## Step 3: Install Dependencies

The `@vercel/node` package has been added to `devDependencies`. Make sure to install it:

```bash
pnpm install
```

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel will auto-detect the configuration from `vercel.json`
4. Click "Deploy"

### Option B: Deploy via CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production:
   ```bash
   vercel --prod
   ```

## Step 5: Configure Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain (e.g., `allresumeservices.com.au`)
4. Follow DNS configuration instructions

## Project Structure for Vercel

```
├── api/
│   └── index.ts          # Serverless function handler
├── client/                # React frontend
├── server/                # Backend code
├── dist/                  # Build output (generated)
│   └── public/           # Static files served by Vercel
├── vercel.json           # Vercel configuration
└── package.json
```

## How It Works

1. **Static Files**: The frontend is built to `dist/public/` and served directly by Vercel
2. **API Routes**: All API requests (`/api/*`) are routed to the serverless function at `api/index.ts`
3. **SPA Routing**: All non-API routes are rewritten to `index.html` for client-side routing
4. **SEO Routes**: `/sitemap.xml` and `/robots.txt` are handled by the serverless function

## Build Process

Vercel will automatically:
1. Run `pnpm install` to install dependencies
2. Run `pnpm build` which:
   - Builds frontend: `vite build` → `dist/public/`
   - Builds backend: `esbuild server/_core/index.ts` → `dist/index.js`
3. Deploy static files from `dist/public/`
4. Deploy serverless function from `api/index.ts`

## Troubleshooting

### Build Fails

- Check that all environment variables are set
- Verify `DATABASE_URL` is correct and accessible
- Check build logs in Vercel dashboard

### API Routes Not Working

- Verify `api/index.ts` is in the correct location
- Check function logs in Vercel dashboard
- Ensure `@vercel/node` is installed

### Static Files Not Loading

- Verify `outputDirectory` in `vercel.json` matches build output
- Check that `dist/public/` contains built files
- Ensure rewrite rules are correct

### Database Connection Issues

- Verify `DATABASE_URL` is correct (should start with `postgresql://`)
- Neon uses connection pooling - make sure you're using the pooler endpoint (contains `-pooler` in the hostname)
- Check SSL mode is set to `require` in connection string
- Neon doesn't require IP whitelisting, but verify your connection string is correct

## Cron Jobs

**Note**: The current setup includes cron jobs (`databaseBackupCron`, `reviewRequestCron`) that won't work in Vercel's serverless environment.

**Solutions**:
1. Use [Vercel Cron](https://vercel.com/docs/cron-jobs) - Add cron configuration to `vercel.json`
2. Use external cron service (e.g., [cron-job.org](https://cron-job.org))
3. Use a separate service for scheduled tasks

Example Vercel Cron configuration:
```json
{
  "crons": [
    {
      "path": "/api/cron/backup",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/review-requests",
      "schedule": "0 10 * * *"
    }
  ]
}
```

## Monitoring

- **Function Logs**: Available in Vercel dashboard under "Functions"
- **Analytics**: Enable in Vercel project settings
- **Error Tracking**: Sentry is already configured in the codebase

## Next Steps

1. ✅ Set up environment variables
2. ✅ Deploy to Vercel
3. ⏳ Configure custom domain
4. ⏳ Set up cron jobs (if needed)
5. ⏳ Test all functionality
6. ⏳ Monitor performance and errors

## Support

For issues specific to:
- **Vercel**: Check [Vercel Documentation](https://vercel.com/docs)
- **Project**: Check `PROJECT_DISCOVERY.md` for project structure
- **Database**: Refer to `HOSTINGER_DEPLOYMENT_GUIDE.md` for database setup details
