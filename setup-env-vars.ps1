# PowerShell script to set Vercel environment variables
# Run this script to configure production environment variables

Write-Host "🚀 Setting up Vercel Environment Variables for Production..." -ForegroundColor Green
Write-Host ""

# Function to set environment variable
function Set-VercelEnv {
    param(
        [string]$Name,
        [string]$Value,
        [string]$Environment = "production"
    )
    
    Write-Host "Setting $Name..." -ForegroundColor Cyan
    $Value | vercel env add $Name $Environment --yes 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $Name set successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to set $Name" -ForegroundColor Red
    }
}

# Core Variables (Known Values)
Write-Host "📦 Setting Core Variables..." -ForegroundColor Yellow
Set-VercelEnv "CRON_SECRET" "nPPm7igX+JSRywMt5OHrSd/IMPHRxF+U/7BU4pKl1oo="
Set-VercelEnv "DATABASE_URL" "postgresql://neondb_owner:npg_tEl9QgKmJ3rB@ep-proud-smoke-a78h2pb8-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
Set-VercelEnv "NODE_ENV" "production"

Write-Host ""
Write-Host "🎨 Setting Frontend Variables..." -ForegroundColor Yellow
Set-VercelEnv "VITE_APP_TITLE" "All Resume Services"
Set-VercelEnv "VITE_APP_LOGO" "/logo.svg"
Set-VercelEnv "OAUTH_SERVER_URL" "https://api.manus.im"
Set-VercelEnv "VITE_OAUTH_PORTAL_URL" "https://portal.manus.im"

Write-Host ""
Write-Host "📧 Setting Email Variables..." -ForegroundColor Yellow
Set-VercelEnv "SES_FROM_EMAIL" "admin@allresumeservices.com.au"
Set-VercelEnv "EMAIL_HOST" "smtp.protonmail.ch"
Set-VercelEnv "EMAIL_PORT" "587"
Set-VercelEnv "EMAIL_USER" "info@allresumeservices.com"

Write-Host ""
Write-Host "💳 Setting PayPal Variables..." -ForegroundColor Yellow
Set-VercelEnv "PAYPAL_MODE" "live"

Write-Host ""
Write-Host "✅ Environment variables setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANT: You still need to set these with actual values:" -ForegroundColor Yellow
Write-Host "   - JWT_SECRET (your JWT secret key)" -ForegroundColor White
Write-Host "   - VITE_APP_ID (your Manus app ID)" -ForegroundColor White
Write-Host "   - OWNER_OPEN_ID (your Manus owner OpenID)" -ForegroundColor White
Write-Host "   - SMTP_PASSWORD (ProtonMail app-specific password)" -ForegroundColor White
Write-Host "   - ADMIN_NOTIFICATION_EMAIL (admin email address)" -ForegroundColor White
Write-Host "   - PAYPAL_CLIENT_ID (PayPal client ID)" -ForegroundColor White
Write-Host "   - PAYPAL_CLIENT_SECRET (PayPal client secret)" -ForegroundColor White
Write-Host ""
Write-Host "To set these manually, use:" -ForegroundColor Cyan
Write-Host "  vercel env add VARIABLE_NAME production" -ForegroundColor White
Write-Host ""
Write-Host "To view all environment variables:" -ForegroundColor Cyan
Write-Host "  vercel env ls" -ForegroundColor White
Write-Host ""
