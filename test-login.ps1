$body = @{
    email = "test@test.com"
    password = "test123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "Login successful!"
    Write-Host "User: $($response.user.firstName) $($response.user.lastName) - $($response.user.role)"
    if ($response.message) {
        Write-Host "Message: $($response.message)"
    }
} catch {
    Write-Host "Error: $($_.Exception.Response.StatusCode)"
    Write-Host "Details: $($_.Exception.Message)"
}
