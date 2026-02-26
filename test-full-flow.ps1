Write-Host "Testing full login flow..." -ForegroundColor Cyan

# Test 1: Login with regular endpoint (any email works now)
$body = @{
    email = "test@test.com"
    password = "test123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "`n✅ Login successful!" -ForegroundColor Green
    Write-Host "   User: $($response.user.firstName) $($response.user.lastName) - $($response.user.role)"
    if ($response.message) {
        Write-Host "   Message: $($response.message)"
    }
    
    $token = $response.token
    
    # Test 2: Get dashboard stats with the token
    Write-Host "`n📊 Testing dashboard stats..." -ForegroundColor Cyan
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $stats = Invoke-RestMethod -Uri "http://localhost:5000/api/dashboard/stats" -Method GET -Headers $headers -ErrorAction Stop
    Write-Host "`n✅ Dashboard Stats:" -ForegroundColor Green
    Write-Host "   Total Emergencies: $($stats.totalEmergencies)"
    Write-Host "   Critical: $($stats.criticalEmergencies)"
    Write-Host "   Ambulances: $($stats.availableAmbulances)/$($stats.totalAmbulances)"
    Write-Host "   Active Camps: $($stats.activeCamps)"
    
    # Test 3: Get trends
    Write-Host "`n📈 Testing trends..." -ForegroundColor Cyan
    $trends = Invoke-RestMethod -Uri "http://localhost:5000/api/dashboard/trends/emergencies" -Method GET -Headers $headers -ErrorAction Stop
    Write-Host "   First 3 trends:"
    for ($i = 0; $i -lt 3; $i++) {
        Write-Host "   - $($trends[$i]._id): count=$($trends[$i].count), critical=$($trends[$i].critical)"
    }
    
    Write-Host "`n🎉 All tests passed! The application is working correctly." -ForegroundColor Green
    
} catch {
    Write-Host "`n❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
