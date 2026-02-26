# PSB6 Startup Script - New Ports
Write-Host ""
Write-Host "=== PSB6 Health Platform - Startup (New Ports) ===" -ForegroundColor Cyan
Write-Host ""

# Start AI Service on Port 3003
Write-Host "[1/3] Starting AI Service on port 3003..." -ForegroundColor Yellow
Start-Job -ScriptBlock { cd "d:\MEDTECVS\psb6-health-platform\ai-service"; python main.py } -Name "ai-service" | Out-Null
Start-Sleep -Seconds 3
Write-Host "OK - AI Service started on port 3003" -ForegroundColor Green
Write-Host ""

# Start Backend on Port 3001
Write-Host "[2/3] Starting Backend Server on port 3001..." -ForegroundColor Yellow
Start-Job -ScriptBlock { cd "d:\MEDTECVS\psb6-health-platform\server"; $env:PORT="3001"; npm run dev } -Name "backend" | Out-Null
Start-Sleep -Seconds 3
Write-Host "OK - Backend started on port 3001" -ForegroundColor Green
Write-Host ""

# Start Frontend on Port 3002
Write-Host "[3/3] Starting Frontend on port 3002..." -ForegroundColor Yellow
Start-Job -ScriptBlock { cd "d:\MEDTECVS\psb6-health-platform\client"; $env:PORT="3002"; npm start } -Name "frontend" | Out-Null
Start-Sleep -Seconds 3
Write-Host "OK - Frontend started on port 3002" -ForegroundColor Green
Write-Host ""

Write-Host "=== Services Started Successfully ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access the application:" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:3002" -ForegroundColor White
Write-Host "  Backend API: http://localhost:3001/api" -ForegroundColor White
Write-Host "  AI Service: http://localhost:3003" -ForegroundColor White
Write-Host ""
Write-Host "Demo Credentials:" -ForegroundColor Green
Write-Host "  Email: admin@healx.com" -ForegroundColor White
Write-Host "  Password: Admin@123456" -ForegroundColor White
Write-Host ""
Write-Host "Background Jobs:" -ForegroundColor Cyan
Get-Job | Format-Table Name, State
Write-Host ""
Write-Host "WARNING: MongoDB not available. DB operations will fail." -ForegroundColor Yellow
Write-Host ""
