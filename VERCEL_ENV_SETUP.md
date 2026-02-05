# Vercel Environment Variables Setup Guide

This guide shows how to add environment variables to your Vercel project using the CLI.

## Prerequisites
- Vercel CLI installed and authenticated (`vercel login`)
- Project linked (`vercel link`)

## Adding Environment Variables

### Database (REQUIRED)

```bash
# PostgreSQL Database URL (from Neon)
vercel env add DATABASE_URL production
# When prompted, paste your full PostgreSQL connection string
# Example: postgresql://user:password@host:port/database?sslmode=require

vercel env add DATABASE_URL preview
# Use same value for preview environments

vercel env add DATABASE_URL development
# Use same value for development
```

### Authentication (REQUIRED)

```bash
# Auth Secret (generate with: openssl rand -hex 32)
vercel env add AUTH_SECRET production
# Paste your 32+ character secret

vercel env add AUTH_SECRET preview
vercel env add AUTH_SECRET development
```

```bash
# Admin Email
vercel env add ADMIN_EMAIL production
# Enter: admin@allresumeservices.com.au (or your admin email)
```

### SMTP Email Configuration (RECOMMENDED)

```bash
# Email User (ProtonMail email)
vercel env add EMAIL_USER production
# Enter: info@allresumeservices.com.au (or your email)

# SMTP Password (ProtonMail SMTP password)
vercel env add SMTP_PASSWORD production
# Paste your ProtonMail SMTP password (will be encrypted)

# Email Host
vercel env add EMAIL_HOST production
# Enter: smtp.protonmail.ch

# Email Port
vercel env add EMAIL_PORT production
# Enter: 587

# Admin Notification Email
vercel env add ADMIN_NOTIFICATION_EMAIL production
# Enter: admin@allresumeservices.com.au (where to send notifications)
```

### PayPal Payment Processing (REQUIRED for checkout)

```bash
# PayPal Client ID
vercel env add PAYPAL_CLIENT_ID production
# Paste your PayPal Client ID from https://developer.paypal.com

# PayPal Client Secret
vercel env add PAYPAL_CLIENT_SECRET production
# Paste your PayPal Client Secret (will be encrypted)

# PayPal Mode
vercel env add PAYPAL_MODE production
# Enter: sandbox (for testing) or live (for production)

# PayPal Webhook ID (optional but recommended)
vercel env add PAYPAL_WEBHOOK_ID production
# Paste your PayPal Webhook ID if you have one
```

### Cron Job Security (RECOMMENDED)

```bash
# Cron Secret (generate with: openssl rand -hex 16)
vercel env add CRON_SECRET production
# Paste your 16+ character secret
```

### Optional: OAuth Providers

```bash
# Google OAuth (if using Google Sign-In)
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production

# GitHub OAuth (if using GitHub Sign-In)
vercel env add GITHUB_CLIENT_ID production
vercel env add GITHUB_CLIENT_SECRET production
```

### Optional: AWS S3 Storage

```bash
# AWS Configuration (if using file uploads)
vercel env add AWS_REGION production
# Enter: ap-southeast-2

vercel env add AWS_ACCESS_KEY_ID production
vercel env add AWS_SECRET_ACCESS_KEY production
vercel env add AWS_S3_BUCKET production
```

## Quick Setup Script

You can also add multiple variables at once. Replace the placeholder values with your actual secrets:

```bash
# Database
vercel env add DATABASE_URL production <<< "your_database_url_here"

# Auth
vercel env add AUTH_SECRET production <<< "your_auth_secret_here"
vercel env add ADMIN_EMAIL production <<< "admin@allresumeservices.com.au"

# SMTP
vercel env add EMAIL_USER production <<< "info@allresumeservices.com.au"
vercel env add SMTP_PASSWORD production <<< "your_smtp_password_here"
vercel env add EMAIL_HOST production <<< "smtp.protonmail.ch"
vercel env add EMAIL_PORT production <<< "587"
vercel env add ADMIN_NOTIFICATION_EMAIL production <<< "admin@allresumeservices.com.au"

# PayPal
vercel env add PAYPAL_CLIENT_ID production <<< "your_paypal_client_id"
vercel env add PAYPAL_CLIENT_SECRET production <<< "your_paypal_client_secret"
vercel env add PAYPAL_MODE production <<< "sandbox"
vercel env add PAYPAL_WEBHOOK_ID production <<< "your_webhook_id"

# Cron
vercel env add CRON_SECRET production <<< "your_cron_secret_here"
```

## Verifying Environment Variables

```bash
# List all environment variables
vercel env ls

# Pull environment variables to local .env.local
vercel env pull .env.local
```

## Important Notes

1. **Sensitive values** (passwords, secrets, API keys) are automatically encrypted by Vercel
2. **Production vs Preview**: Add variables to `production` for live site, `preview` for PR previews, `development` for local dev
3. **After adding variables**: Redeploy your site for changes to take effect
4. **Never commit secrets**: All sensitive values should only exist in Vercel, not in git

## Required Minimum Variables

For the site to function, you MUST set:
- ✅ `DATABASE_URL`
- ✅ `AUTH_SECRET`
- ✅ `ADMIN_EMAIL`

For PayPal checkout to work:
- ✅ `PAYPAL_CLIENT_ID`
- ✅ `PAYPAL_CLIENT_SECRET`
- ✅ `PAYPAL_MODE`

For email notifications:
- ✅ `EMAIL_USER`
- ✅ `SMTP_PASSWORD`
- ✅ `EMAIL_HOST`
- ✅ `EMAIL_PORT`
- ✅ `ADMIN_NOTIFICATION_EMAIL`
