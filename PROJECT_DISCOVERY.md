# All Resume Services - Project Discovery & Vercel Deployment Guide

## Project Overview

**Project Name:** All Resume Services - Professional Resume Writing Website  
**Repository:** Migrated from Manus to GitHub  
**Tech Stack:** 
- **Frontend:** React 19 + Vite + Tailwind CSS 4 + TypeScript
- **Backend:** Express 4 + tRPC 11 + Node.js
- **Database:** PostgreSQL (Neon) with Drizzle ORM
- **Package Manager:** pnpm 10.4.1

## Project Structure

```
allresumeservices-website-main/
├── client/                 # React frontend application
│   ├── src/               # React components and pages
│   ├── public/            # Static assets (images, etc.)
│   └── index.html         # HTML entry point
├── server/                # Express backend server
│   ├── _core/             # Core server utilities
│   │   ├── index.ts       # Server entry point
│   │   ├── env.ts         # Environment variables
│   │   ├── vite.ts        # Vite dev server setup
│   │   └── ...
│   ├── routes/            # Custom routes (sitemap, robots.txt)
│   ├── routers.ts         # tRPC router definitions
│   └── ...
├── shared/                # Shared types and constants
├── drizzle/               # Database migrations and schema
├── dist/                  # Build output (generated)
└── package.json           # Dependencies and scripts
```

## Build Process

### Current Build Scripts
- **`pnpm dev`**: Development mode with Vite HMR
- **`pnpm build`**: 
  - Builds frontend: `vite build` → outputs to `dist/public`
  - Builds backend: `esbuild server/_core/index.ts` → outputs to `dist/index.js`
- **`pnpm start`**: Production server: `node dist/index.js`

### Build Output Structure
```
dist/
├── public/          # Frontend static files (HTML, JS, CSS, assets)
│   └── index.html
└── index.js         # Bundled Express server
```

## Server Architecture

### Express Server Setup
- **Entry Point:** `server/_core/index.ts`
- **Port:** Configurable via `PORT` env var (default: 3000)
- **Static Files:** Served from `dist/public` in production
- **API Routes:**
  - `/api/trpc/*` - tRPC endpoints
  - `/api/oauth/callback` - OAuth callbacks
  - `/sitemap.xml` - SEO sitemap
  - `/robots.txt` - SEO robots file

### Development vs Production
- **Development:** Uses Vite middleware for HMR
- **Production:** Serves static files from `dist/public`

## Required Environment Variables

### Core Application
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
JWT_SECRET=your_jwt_secret_key
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
OWNER_OPEN_ID=your_open_id
```

### Frontend Configuration
```env
VITE_APP_TITLE=All Resume Services
VITE_APP_LOGO=/logo.svg
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your_website_id
```

### AWS S3 Storage
```env
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your_bucket_name
```

### Email Service (Amazon SES)
```env
SES_FROM_EMAIL=admin@allresumeservices.com.au
```

### PayPal Integration
```env
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=live  # or 'sandbox' for testing
```

### Optional Services
```env
BUILT_IN_FORGE_API_URL=...
BUILT_IN_FORGE_API_KEY=...
```

## Database

- **Type:** PostgreSQL (Neon)
- **ORM:** Drizzle ORM
- **Driver:** postgres (postgres-js)
- **Migrations:** `pnpm db:push` (generates and applies migrations)
- **Schema Location:** `drizzle/schema.ts`
- **Config:** `drizzle.config.ts`
- **Connection String Format:** `postgresql://user:password@host:port/database?sslmode=require`

## Key Features

1. **Blog System** - Content management with markdown support
2. **Case Studies** - Industry-specific case studies
3. **Testimonials** - Client testimonials management
4. **Contact Forms** - Email notifications via Amazon SES
5. **Payment Processing** - PayPal integration
6. **OAuth Authentication** - Manus OAuth integration
7. **File Uploads** - AWS S3 storage integration
8. **SEO** - Sitemap and robots.txt generation
9. **Analytics** - Umami analytics integration
10. **Live Chat** - Tawk.to integration

## Dependencies Summary

### Frontend
- React 19, React DOM 19
- Vite 7
- Tailwind CSS 4
- tRPC Client
- Radix UI components
- Framer Motion
- React Query

### Backend
- Express 4
- tRPC Server
- Drizzle ORM
- MySQL2
- AWS SDK v3
- Nodemailer
- Node-cron

## Vercel Deployment Considerations

### Challenges
1. **Full-Stack Express App** - Vercel uses serverless functions, need to adapt Express app
2. **MySQL Database** - Requires external MySQL database (PlanetScale, Railway, etc.)
3. **File Storage** - Already using AWS S3 (good for Vercel)
4. **Cron Jobs** - Need to migrate to Vercel Cron or external service
5. **Static File Serving** - Need proper configuration

### Solutions
1. Create serverless function wrapper for Express app
2. Use Vercel's serverless functions for API routes
3. Configure build settings for monorepo structure
4. Set up environment variables in Vercel dashboard
5. Use Vercel Cron for scheduled tasks

## Next Steps for Vercel Deployment

1. ✅ Create `vercel.json` configuration
2. ✅ Create serverless function wrapper
3. ⏳ Set up environment variables in Vercel
4. ⏳ Configure database connection (external MySQL)
5. ⏳ Test build process
6. ⏳ Deploy and verify
