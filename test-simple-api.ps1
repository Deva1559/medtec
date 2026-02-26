# Test login and dashboard
$body = @{
    email = "test@test.com"
    password = "test"
} | ConvertTo-Json

$loginResp = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
Write-Host "Login successful. Token received."

$token = $loginResp.token
Write-Host "Token: $token"

$headers = @{
    "Authorization" = "Bearer $token"
}

# Test dashboard
try {
    $stats = Invoke-RestMethod -Uri "http://localhost:5000/api/dashboard/stats" -Headers $headers -ErrorAction Stop
    Write-Host "Dashboard stats: Success"
    Write-Host ($stats | ConvertTo-Json)
} catch {
    Write-Host "Dashboard error: $($_.Exception.Message)"
}

# Test trends
try {
    $trends = Invoke-RestMethod -Uri "http://localhost:5000/api/dashboard/trends/emergencies" -Headers $headers -ErrorAction Stop
    Write-Host "Trends: Success"
    Write-Host ($trends | ConvertTo-Json)
} catch {
    Write-Host "Trends error: $($_.Exception.Message)"
}
