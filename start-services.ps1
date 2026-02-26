# PSB6 Startup Script
Write-Host ""
Write-Host "=== PSB6 Health Platform - Startup ===" -ForegroundColor Cyan
Write-Host ""

# Start AI Service
Write-Host "[1/3] Starting AI Service..." -ForegroundColor Yellow
Start-Job -ScriptBlock { cd "d:\MEDTECVS\psb6-health-platform\ai-service"; python main.py } -Name "ai-service" -ArgumentList @() | Out-Null
Start-Sleep -Seconds 3
Write-Host "OK - AI Service started on port 8000" -ForegroundColor Green
Write-Host ""

# Start Backend
Write-Host "[2/3] Starting Backend Server..." -ForegroundColor Yellow
Start-Job -ScriptBlock { cd "d:\MEDTECVS\psb6-health-platform\server"; npm run dev } -Name "backend" -ArgumentList @() | Out-Null
Start-Sleep -Seconds 3
Write-Host "OK - Backend started on port 5000" -ForegroundColor Green
Write-Host ""

# Start Frontend
Write-Host "[3/3] Starting Frontend..." -ForegroundColor Yellow
Start-Job -ScriptBlock { cd "d:\MEDTECVS\psb6-health-platform\client"; npm start } -Name "frontend" -ArgumentList @() | Out-Null
Start-Sleep -Seconds 3
Write-Host "OK - Frontend started on port 3000" -ForegroundColor Green
Write-Host ""

Write-Host "=== Services Started Successfully ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access the application:" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  Backend API: http://localhost:5000/api" -ForegroundColor White
Write-Host "  AI Service: http://localhost:8000" -ForegroundColor White
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
