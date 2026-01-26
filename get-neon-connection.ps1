# Get Neon Database Connection String using PowerShell
# This script fetches the connection string from Neon API and updates .env file

$NEON_API_KEY = "napi_f4kl5zlimjyb1rgh44atz0p5ct9l94bltpvwnpfp4avih3i04mo2ry750uc0edl3"
$NEON_API_BASE = "https://console.neon.tech/api/v2"

# Ensure TLS 1.2 is used
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

Write-Host "Fetching Neon projects..." -ForegroundColor Cyan
Write-Host ""

try {
    # Get projects - try with and without trailing slash
    $headers = @{
        "Authorization" = "Bearer $NEON_API_KEY"
        "Accept" = "application/json"
        "Content-Type" = "application/json"
    }
    
    # Try the projects endpoint
    $uri = "$NEON_API_BASE/projects"
    Write-Host "Calling: $uri" -ForegroundColor Gray
    
    try {
        $projectsResponse = Invoke-RestMethod -Uri $uri -Method Get -Headers $headers -ErrorAction Stop
    } catch {
        # If that fails, try with trailing slash
        Write-Host "Trying with trailing slash..." -ForegroundColor Gray
        $uri = "$NEON_API_BASE/projects/"
        $projectsResponse = Invoke-RestMethod -Uri $uri -Method Get -Headers $headers -ErrorAction Stop
    }
    
    Write-Host ""
    
    if (-not $projectsResponse.projects -or $projectsResponse.projects.Count -eq 0) {
        Write-Host "ERROR: No projects found." -ForegroundColor Red
        Write-Host ""
        Write-Host "Please create a project at: https://console.neon.tech" -ForegroundColor Yellow
        exit 1
    }
    
    $projects = $projectsResponse.projects
    Write-Host "Found $($projects.Count) project(s):" -ForegroundColor Green
    Write-Host ""
    
    foreach ($project in $projects) {
        Write-Host "  - $($project.name) (ID: $($project.id))" -ForegroundColor White
        Write-Host "    Region: $($project.region_id)" -ForegroundColor Gray
        Write-Host ""
    }
    
    # Use the first project
    $selectedProject = $projects[0]
    Write-Host "Getting connection string for: $($selectedProject.name)" -ForegroundColor Cyan
    Write-Host ""
    
    # Get endpoints
    $endpointsResponse = Invoke-RestMethod -Uri "$NEON_API_BASE/projects/$($selectedProject.id)/endpoints" -Method Get -Headers $headers
    
    if (-not $endpointsResponse.endpoints -or $endpointsResponse.endpoints.Count -eq 0) {
        Write-Host "ERROR: No endpoints found for this project." -ForegroundColor Red
        exit 1
    }
    
    $endpoint = $endpointsResponse.endpoints[0]
    
    # Prefer pooler endpoint
    $host = $endpoint.host
    if (-not $host -like "*pooler*") {
        $host = $host -replace "\.neon\.tech$", "-pooler.neon.tech"
    }
    
    if (-not $endpoint.password -or -not $endpoint.user -or -not $endpoint.database_name) {
        Write-Host "ERROR: Incomplete endpoint information." -ForegroundColor Red
        exit 1
    }
    
    $connectionString = "postgresql://$($endpoint.user):$($endpoint.password)@$host/$($endpoint.database_name)?sslmode=require&channel_binding=require"
    
    Write-Host "SUCCESS: Connection string retrieved!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Connection Details:" -ForegroundColor Cyan
    Write-Host "   Host: $host" -ForegroundColor White
    Write-Host "   Database: $($endpoint.database_name)" -ForegroundColor White
    Write-Host "   User: $($endpoint.user)" -ForegroundColor White
    Write-Host ""
    
    # Update .env file
    $envPath = ".env"
    if (Test-Path $envPath) {
        $envContent = Get-Content $envPath -Raw
        
        # Update or add DATABASE_URL
        if ($envContent -match "DATABASE_URL=") {
            $envContent = $envContent -replace "DATABASE_URL=.*", "DATABASE_URL=$connectionString"
        } else {
            $envContent = "DATABASE_URL=$connectionString`r`n$envContent"
        }
        
        Set-Content -Path $envPath -Value $envContent -NoNewline
        Write-Host "SUCCESS: Updated .env file with connection string!" -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host ".env file not found. Add this line:" -ForegroundColor Yellow
        Write-Host "DATABASE_URL=$connectionString" -ForegroundColor White
        Write-Host ""
    }
    
    Write-Host "Next step: Run 'pnpm db:setup' to verify the connection." -ForegroundColor Cyan
    Write-Host ""
    
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   HTTP Status: $statusCode" -ForegroundColor Yellow
        
        if ($statusCode -eq 401) {
            Write-Host "   Authentication failed. Please check your NEON_API_KEY." -ForegroundColor Yellow
        } elseif ($statusCode -eq 404) {
            Write-Host "   Endpoint not found. The API endpoint might have changed." -ForegroundColor Yellow
            Write-Host "   Please try getting the connection string manually from:" -ForegroundColor Yellow
            Write-Host "   https://console.neon.tech" -ForegroundColor Cyan
        }
        
        # Try to read error response
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "   Response: $responseBody" -ForegroundColor Gray
        } catch {
            # Ignore if we can't read the response
        }
    }
    
    Write-Host ""
    Write-Host "Alternative: Get your connection string manually from:" -ForegroundColor Yellow
    Write-Host "   https://console.neon.tech" -ForegroundColor Cyan
    Write-Host "   Then update DATABASE_URL in your .env file." -ForegroundColor Yellow
    exit 1
}
