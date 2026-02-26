# HEALX Platform - Predefined Login Credentials

## Valid Credentials (Only these combinations work)

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@healx.com` | `admin@123` |
| **Doctor** | `doctor1@healx.com` | `doctor1@123` |
| **Patient** | `patient1@healx.com` | `patient1@123` |

## Authentication Behavior

### ✅ Successful Login
- Enter any of the valid email/password combinations above
- You will receive a JWT token and user data
- Redirected to the dashboard

### ❌ Error Cases (Will show "Invalid email or password")
- **Wrong Email**: Any email not in the list above (e.g., `user@example.com`)
- **Wrong Password**: Any password that doesn't match the email (e.g., `admin@healx.com` with `wrongpassword`)
- **Missing Fields**: Empty email or password fields

## API Endpoints

### Regular Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@healx.com",
  "password": "admin@123"
}
```

### Demo Login
```
POST /api/auth/demo-login
Content-Type: application/json

{
  "email": "admin@healx.com",
  "password": "admin@123"
}
```

## Security Notes
- The system now strictly validates credentials against predefined accounts only
- No auto-creation of demo users for unknown emails
- All failed attempts return 401 Unauthorized with message "Invalid email or password"
- Passwords are case-sensitive
