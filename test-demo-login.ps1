# Test demo login and dashboard API
$ErrorActionPreference = "Stop"

# Step 1: Login as demo user
Write-Host "Testing demo login..."
$loginBody = @{
    email = "admin@healx.com"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/demo-login" -Method POST -Body $loginBody -ContentType "application/json"

Write-Host "Login successful! Token: $($loginResponse.token.Substring(0, 50))..."
Write-Host "User: $($loginResponse.user.firstName) $($loginResponse.user.lastName) - $($loginResponse.user.role)"

$token = $loginResponse.token

# Step 2: Test dashboard stats with auth token
Write-Host "`nTesting dashboard stats..."
$headers = @{
    "Authorization" = "Bearer $token"
}

$statsResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/dashboard/stats" -Method GET -Headers $headers
Write-Host "Dashboard Stats:"
Write-Host "  Total Emergencies: $($statsResponse.totalEmergencies)"
Write-Host "  Critical: $($statsResponse.criticalEmergencies)"
Write-Host "  Ambulances: $($statsResponse.availableAmbulances)/$($statsResponse.totalAmbulances)"
Write-Host "  Active Camps: $($statsResponse.activeCamps)"

# Step 3: Test trends
Write-Host "`nTesting trends..."
$trendsResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/dashboard/trends/emergencies" -Method GET -Headers $headers
Write-Host "Trends (first 3):"
$trendsResponse | Select-Object -First 3 | ForEach-Object { Write-Host "  $_" }

Write-Host "`n✅ All API tests passed! Demo mode is working."
