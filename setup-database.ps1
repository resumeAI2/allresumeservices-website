# Database Setup Script for Neon PostgreSQL (PowerShell version)
# This script verifies the database connection and shows database status

$ErrorActionPreference = "Stop"

# Load .env file
$envFile = ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
    exit 1
}

# Read DATABASE_URL from .env
$envContent = Get-Content $envFile -Raw
if ($envContent -match "DATABASE_URL=(.+)") {
    $DATABASE_URL = $matches[1].Trim()
} else {
    Write-Host "ERROR: DATABASE_URL not found in .env file!" -ForegroundColor Red
    exit 1
}

Write-Host "Neon Database Setup Script" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan
Write-Host ""

# Validate connection string
if (-not $DATABASE_URL.StartsWith("postgresql://")) {
    Write-Host "ERROR: DATABASE_URL must start with postgresql://" -ForegroundColor Red
    exit 1
}

Write-Host "DATABASE_URL is set" -ForegroundColor Green
Write-Host "Connection string format: $($DATABASE_URL.Substring(0, [Math]::Min(50, $DATABASE_URL.Length)))..." -ForegroundColor Gray
Write-Host ""

# Test connection using psql if available, otherwise provide instructions
Write-Host "Testing database connection..." -ForegroundColor Cyan

# Check if psql is available
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
if ($psqlPath) {
    try {
        # Extract connection details for psql
        $connectionParts = $DATABASE_URL -replace "postgresql://", "" -split "/"
        $authAndHost = $connectionParts[0]
        $database = $connectionParts[1] -split "\?" | Select-Object -First 1
        
        $authParts = $authAndHost -split "@"
        $userPass = $authParts[0] -split ":"
        $host = $authParts[1]
        
        $user = $userPass[0]
        $password = $userPass[1]
        
        # Set password as environment variable for psql
        $env:PGPASSWORD = $password
        
        # Test connection
        $testQuery = "SELECT version(), current_database(), current_user;"
        $result = & psql -h $host -U $user -d $database -c $testQuery 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "SUCCESS: Database connection successful!" -ForegroundColor Green
            Write-Host ""
            
            # Parse version info
            $versionLine = ($result | Select-String "PostgreSQL").ToString()
            if ($versionLine) {
                Write-Host "Database Information:" -ForegroundColor Cyan
                Write-Host "  $versionLine" -ForegroundColor White
            }
            Write-Host ""
        } else {
            Write-Host "ERROR: Connection test failed" -ForegroundColor Red
            Write-Host $result -ForegroundColor Yellow
            exit 1
        }
    } catch {
        Write-Host "ERROR: Failed to test connection: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    } finally {
        # Clear password from environment
        Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    }
} else {
    Write-Host "INFO: psql not found. Skipping connection test." -ForegroundColor Yellow
    Write-Host "      Connection string appears to be valid format." -ForegroundColor Gray
    Write-Host ""
    Write-Host "To test connection manually, install PostgreSQL client tools or use:" -ForegroundColor Yellow
    Write-Host "  pnpm db:setup" -ForegroundColor Cyan
    Write-Host ""
}

# Check for existing tables (if we can connect)
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Run migrations to set up the database schema:" -ForegroundColor White
Write-Host "   pnpm db:push" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Or use drizzle-kit directly:" -ForegroundColor White
Write-Host "   pnpm drizzle-kit push" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Verify tables are created in Neon dashboard:" -ForegroundColor White
Write-Host "   https://console.neon.tech" -ForegroundColor Cyan
Write-Host ""

Write-Host "Setup check complete!" -ForegroundColor Green
Write-Host ""
