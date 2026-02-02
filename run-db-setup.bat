@echo off
REM Database Setup Batch Script
REM This script runs the database setup and migrations

echo ========================================
echo Neon Database Setup
echo ========================================
echo.

REM Check if node is available
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not in PATH.
    echo Please ensure Node.js is installed and added to your system PATH.
    echo.
    pause
    exit /b 1
)

REM Check if pnpm is available
where pnpm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: pnpm is not in PATH. Trying npm instead...
    set USE_NPM=1
) else (
    set USE_NPM=0
)

echo Step 1: Verifying database connection...
echo.

if %USE_NPM%==1 (
    npm run db:setup
) else (
    pnpm db:setup
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Database connection verification failed.
    echo Please check your DATABASE_URL in .env file.
    pause
    exit /b 1
)

echo.
echo Step 2: Running database migrations...
echo.

if %USE_NPM%==1 (
    npm run db:push
) else (
    pnpm db:push
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Database migration failed.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Database setup complete!
echo ========================================
echo.
echo Your database has been set up successfully.
echo You can verify tables in the Neon dashboard:
echo https://console.neon.tech
echo.
pause
