$body = @{
    email = "admin@healx.com"
    password = "Admin@123456"
} | ConvertTo-Json

$response = Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/auth/login" -ContentType "application/json" -Body $body
$response | ConvertTo-Json
