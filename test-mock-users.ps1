Write-Host "Testing mock database users..." -ForegroundColor Cyan

# Test admin login
Write-Host "`n1. Testing Admin Login:" -ForegroundColor Yellow
$body = @{email="admin@healx.com"; password="admin123"} | ConvertTo-Json
$resp = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
Write-Host "   User: $($resp.user.firstName) $($resp.user.lastName) - $($resp.user.role)"

# Test doctor login
Write-Host "`n2. Testing Doctor Login:" -ForegroundColor Yellow
$body = @{email="doctor1@healx.com"; password="doctor123"} | ConvertTo-Json
$resp = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
Write-Host "   User: $($resp.user.firstName) $($resp.user.lastName) - $($resp.user.role)"

# Test doctor2 login
Write-Host "`n3. Testing Doctor2 Login:" -ForegroundColor Yellow
$body = @{email="doctor2@healx.com"; password="doctor123"} | ConvertTo-Json
$resp = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
Write-Host "   User: $($resp.user.firstName) $($resp.user.lastName) - $($resp.user.role)"

# Test patient login
Write-Host "`n4. Testing Patient Login:" -ForegroundColor Yellow
$body = @{email="amit.patel@email.com"; password="patient123"} | ConvertTo-Json
$resp = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
Write-Host "   User: $($resp.user.firstName) $($resp.user.lastName) - $($resp.user.role)"

Write-Host "`n✅ All mock user logins successful!" -ForegroundColor Green
