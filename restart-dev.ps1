# Quick restart script for dev server
Write-Host "Stopping any existing dev servers..." -ForegroundColor Yellow

# Kill processes on ports 3000 and 3001
$ports = @(3000, 3001)
foreach ($port in $ports) {
    $connections = netstat -ano | findstr ":$port"
    if ($connections) {
        $connections | ForEach-Object {
            $parts = $_ -split '\s+'
            $pid = $parts[-1]
            if ($pid -match '^\d+$') {
                Write-Host "Killing process $pid on port $port" -ForegroundColor Cyan
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

Start-Sleep -Seconds 2

Write-Host "`nStarting dev server..." -ForegroundColor Green
Set-Location "C:\Users\kryst\Desktop\ARS WEBSITE CODE\allresumeservices-website-main"
pnpm dev
