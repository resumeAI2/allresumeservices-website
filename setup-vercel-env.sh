#!/bin/bash

# Vercel Environment Variables Setup Script
# This script sets up all required environment variables for production deployment

echo "🚀 Setting up Vercel Environment Variables..."
echo ""

# CRON_SECRET (Generated)
CRON_SECRET="nPPm7igX+JSRywMt5OHrSd/IMPHRxF+U/7BU4pKl1oo="
echo "✅ Setting CRON_SECRET..."
echo "$CRON_SECRET" | vercel env add CRON_SECRET production

# DATABASE_URL (From .env)
DATABASE_URL="postgresql://neondb_owner:npg_tEl9QgKmJ3rB@ep-proud-smoke-a78h2pb8-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
echo "✅ Setting DATABASE_URL..."
echo "$DATABASE_URL" | vercel env add DATABASE_URL production

# NODE_ENV
echo "✅ Setting NODE_ENV..."
echo "production" | vercel env add NODE_ENV production

# Frontend Configuration
echo "✅ Setting VITE_APP_TITLE..."
echo "All Resume Services" | vercel env add VITE_APP_TITLE production

echo "✅ Setting VITE_APP_LOGO..."
echo "/logo.svg" | vercel env add VITE_APP_LOGO production

echo "✅ Setting OAUTH_SERVER_URL..."
echo "https://api.manus.im" | vercel env add OAUTH_SERVER_URL production

echo "✅ Setting VITE_OAUTH_PORTAL_URL..."
echo "https://portal.manus.im" | vercel env add VITE_OAUTH_PORTAL_URL production

echo "✅ Setting SES_FROM_EMAIL..."
echo "admin@allresumeservices.com.au" | vercel env add SES_FROM_EMAIL production

echo "✅ Setting PAYPAL_MODE..."
echo "live" | vercel env add PAYPAL_MODE production

echo ""
echo "✅ Core environment variables set!"
echo ""
echo "⚠️  IMPORTANT: You still need to set these manually:"
echo "   - JWT_SECRET (your JWT secret key)"
echo "   - VITE_APP_ID (your Manus app ID)"
echo "   - OWNER_OPEN_ID (your Manus owner OpenID)"
echo "   - EMAIL_USER (ProtonMail username)"
echo "   - SMTP_PASSWORD (ProtonMail app password)"
echo "   - EMAIL_HOST (smtp.protonmail.ch)"
echo "   - EMAIL_PORT (587)"
echo "   - ADMIN_NOTIFICATION_EMAIL (admin email)"
echo "   - PAYPAL_CLIENT_ID (PayPal client ID)"
echo "   - PAYPAL_CLIENT_SECRET (PayPal client secret)"
echo ""
echo "To set these, use:"
echo "  vercel env add VARIABLE_NAME production"
echo ""
