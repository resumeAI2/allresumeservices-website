# Database Setup PowerShell Script
# This script runs the database setup and migrations

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Neon Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if node is available
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCmd) {
    Write-Host "ERROR: Node.js is not in PATH." -ForegroundColor Red
    Write-Host "Please ensure Node.js is installed and added to your system PATH." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Common installation locations:" -ForegroundColor Yellow
    Write-Host "  C:\Program Files\nodejs\" -ForegroundColor Gray
    Write-Host "  C:\Program Files (x86)\nodejs\" -ForegroundColor Gray
    Write-Host "  $env:LOCALAPPDATA\Programs\nodejs\" -ForegroundColor Gray
    Write-Host ""
    pause
    exit 1
}

# Check if pnpm is available
$pnpmCmd = Get-Command pnpm -ErrorAction SilentlyContinue
$useNpm = $false

if (-not $pnpmCmd) {
    Write-Host "WARNING: pnpm is not in PATH. Trying npm instead..." -ForegroundColor Yellow
    $npmCmd = Get-Command npm -ErrorAction SilentlyContinue
    if (-not $npmCmd) {
        Write-Host "ERROR: Neither pnpm nor npm found in PATH." -ForegroundColor Red
        pause
        exit 1
    }
    $useNpm = $true
}

Write-Host "Step 1: Verifying database connection..." -ForegroundColor Cyan
Write-Host ""

if ($useNpm) {
    npm run db:setup
} else {
    pnpm db:setup
}

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Database connection verification failed." -ForegroundColor Red
    Write-Host "Please check your DATABASE_URL in .env file." -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host ""
Write-Host "Step 2: Running database migrations..." -ForegroundColor Cyan
Write-Host ""

if ($useNpm) {
    npm run db:push
} else {
    pnpm db:push
}

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Database migration failed." -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Database setup complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your database has been set up successfully." -ForegroundColor White
Write-Host "You can verify tables in the Neon dashboard:" -ForegroundColor White
Write-Host "https://console.neon.tech" -ForegroundColor Cyan
Write-Host ""
pause
