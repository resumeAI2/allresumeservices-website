# All Resume Services - Hostinger Deployment Guide

## Project Overview

**Project Name:** All Resume Services - Professional Resume Writing  
**Tech Stack:** React 19 + Tailwind CSS 4 + Express 4 + tRPC 11 + MySQL  
**Type:** Full-stack web application with backend server, database, and authentication

## System Requirements

Hostinger must support:
- **Node.js 22.x or higher** (LTS version)
- **MySQL 8.0+** database
- **npm/pnpm** package managers
- **Environment variables** configuration
- **SSL/TLS certificates** (for HTTPS)
- **Port 3000** (or custom port) for the application server

## Pre-Deployment Checklist

- [ ] Hostinger account with Node.js hosting capability
- [ ] MySQL database created and accessible
- [ ] Domain (allresumeservices.com.au) pointing to Hostinger nameservers
- [ ] SSL certificate (auto-provisioned by Hostinger)
- [ ] Git repository access (optional but recommended)

## Step 1: Database Setup

### Create MySQL Database

1. Log into Hostinger control panel
2. Go to **Databases** section
3. Create new MySQL database with:
   - **Database name:** `allresumeservices_db`
   - **User:** `allresumeservices_user`
   - **Password:** [Generate strong password]
   - **Charset:** utf8mb4
   - **Collation:** utf8mb4_unicode_ci

4. Note the connection details:
   - **Host:** (provided by Hostinger, usually localhost or IP)
   - **Port:** (usually 3306)
   - **Database:** allresumeservices_db
   - **User:** allresumeservices_user
   - **Password:** [your password]

### Run Database Migrations

Once database is created, you'll need to run migrations. See Step 4 below.

## Step 2: Environment Variables Setup

Create a `.env` file in the project root with these variables:

```env
# Database Connection
DATABASE_URL=mysql://allresumeservices_user:PASSWORD@HOST:PORT/allresumeservices_db

# Application
NODE_ENV=production
PORT=3000

# OAuth (Manus or your auth provider)
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
JWT_SECRET=your_jwt_secret_key

# Email Service (SMTP)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=your_email@allresumeservices.com.au
SMTP_PASSWORD=your_email_password
ADMIN_NOTIFICATION_EMAIL=admin@allresumeservices.com.au

# PayPal (if using PayPal payments)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox  # Change to 'live' for production

# Application Settings
VITE_APP_TITLE=All Resume Services
VITE_APP_LOGO=/logo.svg
OWNER_NAME=Your Name
OWNER_OPEN_ID=your_open_id

# File Storage (S3 or Hostinger's file storage)
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your_bucket_name
```

**Important:** Never commit `.env` file to git. Add it to `.gitignore`.

## Step 3: Upload Project Files

### Option A: Using Git (Recommended)

1. Push your code to a private GitHub repository
2. In Hostinger control panel, go to **Git** section
3. Connect your GitHub account
4. Select the repository and branch to deploy
5. Hostinger will auto-pull and deploy

### Option B: Manual Upload via FTP/SFTP

1. Download the exported project code
2. Connect via SFTP using Hostinger credentials
3. Upload to the public_html or designated folder
4. Ensure proper file permissions (755 for directories, 644 for files)

## Step 4: Install Dependencies & Build

### SSH into Hostinger Server

```bash
# Connect via SSH
ssh username@your-hostinger-server.com

# Navigate to project directory
cd /home/username/public_html/allresumeservices-website

# Install dependencies
npm install
# or
pnpm install

# Run database migrations
npm run db:push
# This will:
# 1. Generate migration files from schema
# 2. Apply migrations to the database
# 3. Create all necessary tables

# Build the project
npm run build
```

## Step 5: Start the Application

### Using Node directly

```bash
npm start
# or
node dist/index.js
```

### Using PM2 (Recommended for production)

```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start dist/index.js --name "allresumeservices"

# Make it start on server restart
pm2 startup
pm2 save

# View logs
pm2 logs allresumeservices

# Restart/stop application
pm2 restart allresumeservices
pm2 stop allresumeservices
```

### Using Hostinger's Application Manager

1. Go to Hostinger control panel → **Node.js Applications**
2. Create new application:
   - **Application name:** allresumeservices
   - **Application root:** /public_html/allresumeservices-website
   - **Startup file:** dist/index.js
   - **Node.js version:** 22.x
   - **Port:** 3000 (Hostinger will proxy to your domain)

## Step 6: Configure Domain & SSL

1. In Hostinger control panel → **Domains**
2. Point domain to Hostinger nameservers
3. Add DNS records:
   - **Type:** A Record
   - **Name:** @ (for root domain)
   - **Value:** Hostinger's server IP
4. SSL certificate will be auto-provisioned (Let's Encrypt)
5. Enable HTTPS redirect in application settings

## Step 7: Configure Reverse Proxy (if needed)

If Hostinger uses a reverse proxy setup, configure it to forward requests to your Node.js application on port 3000.

**Nginx example:**

```nginx
server {
    listen 80;
    server_name allresumeservices.com.au www.allresumeservices.com.au;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Step 8: Verify Deployment

1. Visit https://allresumeservices.com.au
2. Check that:
   - Homepage loads correctly
   - All images display
   - Navigation works
   - Blog page loads
   - Forms submit successfully
3. Check server logs for errors:
   ```bash
   pm2 logs allresumeservices
   ```

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED
```

**Solution:**
- Verify DATABASE_URL is correct
- Check database user has proper permissions
- Ensure database is accessible from Hostinger server
- Test connection: `mysql -h HOST -u USER -p DATABASE`

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
- Change PORT in .env file
- Kill existing process: `lsof -i :3000` then `kill -9 PID`
- Use PM2 to manage processes

### Missing Environment Variables

```
Error: VITE_APP_ID is not defined
```

**Solution:**
- Verify all variables in .env file
- Restart application after changing .env
- Check .env file is in correct location (project root)

### Build Errors

```
Error: Cannot find module 'package-name'
```

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
npm install
npm run build
```

### SSL Certificate Issues

- Let's Encrypt certificates auto-renew
- If manual renewal needed: Contact Hostinger support
- Ensure domain is properly configured in DNS

## Performance Optimization

1. **Enable Gzip compression** in Hostinger settings
2. **Set up caching headers** for static assets
3. **Monitor server resources** in Hostinger control panel
4. **Set up log rotation** to prevent disk space issues
5. **Use CDN** for static assets (optional)

## Monitoring & Maintenance

### Regular Checks

- Monitor application logs: `pm2 logs`
- Check database size and backups
- Monitor server CPU/memory usage
- Review error logs weekly

### Backups

1. **Database backups:** Set up automatic backups in Hostinger
2. **File backups:** Enable Hostinger's backup service
3. **Code backups:** Maintain Git repository

### Updates

- Keep Node.js updated to latest LTS
- Update npm packages regularly: `npm update`
- Monitor security advisories: `npm audit`

## Support & Escalation

If you encounter issues:

1. **Check Hostinger documentation** for Node.js hosting
2. **Contact Hostinger support** with:
   - Error messages from logs
   - Steps to reproduce
   - Environment details
3. **Reference this guide** when communicating with support

## Additional Resources

- **Node.js Documentation:** https://nodejs.org/docs/
- **Express.js Guide:** https://expressjs.com/
- **Drizzle ORM:** https://orm.drizzle.team/
- **tRPC Documentation:** https://trpc.io/

---

**Last Updated:** January 2026  
**Project Version:** 5f417e91
