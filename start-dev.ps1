# PowerShell script to start the development server on Windows
# Make sure Node.js and pnpm are installed first

# Navigate to project directory
Set-Location $PSScriptRoot

# Check if node_modules exists, if not install dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install dependencies. Make sure pnpm is installed." -ForegroundColor Red
        exit 1
    }
}

# Set environment variable for Windows PowerShell
$env:NODE_ENV = "development"

# Start the development server
Write-Host "Starting development server..." -ForegroundColor Green
pnpm dev
