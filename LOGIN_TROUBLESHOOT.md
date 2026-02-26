# ❌ Login Error After Demo Fix - Troubleshooting Guide

## 🔍 What's Happening

When you click login or demo buttons, you're getting an error. This guide helps identify and fix the issue.

---

## 🚀 QUICK TEST (Do This First)

### Step 1: Open Test Dashboard
```
http://localhost:3000/test-api.html
```

### Step 2: Click "Test Backend Health"
- If you see: ✅ `Backend OK` - Backend is running
- If you see: ❌ Error - Backend is down

### Step 3: Click "Test Demo Login"  
- If you see: ✅ `Demo login successful` - API working
- If you see: ❌ Error - Check error message

### Step 4: Check Browser Console
```
Press F12 → Console tab
Look for red error messages
```

---

## 🔧 Common Issues & Fixes

### Issue 1: "Cannot find module 'mock-db'"

**Error Message:**
```
Error: Cannot find module '../mock-db.js'
```

**Fix:**
The mock-db.js file needs to exist. Check if it's in:
```
d:\MEDTECVS\psb6-health-platform\server\mock-db.js
```

If missing, recreate it:
File should contain users and exports.

### Issue 2: "JWT_SECRET is undefined"

**Error Message:**
```
TypeError: JWT_SECRET is undefined
```

**Fix:**
1. Check `.env` file exists:
   ```
   d:\MEDTECVS\psb6-health-platform\server\.env
   ```

2. If missing, create it with:
   ```
   MONGODB_URI=mongodb://localhost:27017/healx
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   NODE_ENV=development
   AI_SERVICE_URL=http://localhost:8000
   DEMO_MODE=true
   MOCK_DATABASE=true
   ```

3. Restart backend

### Issue 3: "Cannot GET /api/auth/login"

**Error Message:**
```
Cannot GET /api/auth/login
OR
404 Not Found
```

**Fix:**
Routes not loaded. Check `server/routes/auth.js` exists with POST /login

Restart backend:
```powershell
Stop-Job -Name backend
npm run dev
```

### Issue 4: "Network Error / Cannot reach localhost:5000"

**Error Message:**
```
Failed to fetch
Network error
```

**Fix:**
Backend not running. Check:
```powershell
netstat -ano | Select-String "5000"
```

If nothing, restart:
```powershell
cd server
npm run dev
```

### Issue 5: "Login successful but page doesn't change"

**Possible Causes:**
1. Dashboard page has errors
2. AuthContext not working
3. Navigation broken

**Fix:**
1. Hard refresh: `Ctrl+Shift+R`
2. Check browser console for errors
3. Check localStorage was set:
   - F12 → Application → LocalStorage
   - Should see: `token` and `user`

---

## 🧪 Manual API Testing

### Test Login via Terminal

```powershell
# Test regular login
$body = @{ 
    email = 'admin@healx.com'
    password = 'Admin@123456'
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

# Test demo login
$body = @{ email = 'admin@healx.com' } | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/demo-login" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

Expected Response:
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "1",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@healx.com",
    "role": "admin"
  }
}
```

---

## 📋 Diagnostic Checklist

- [ ] Backend is running (`npm run dev` in server dir)
- [ ] Frontend is running (`npm start` in client dir)
- [ ] Port 5000 is accessible
- [ ] `.env` file exists in server directory
- [ ] `mock-db.js` exists in server directory
- [ ] `auth.js` routes exist with `/login` and `/demo-login`
- [ ] Browser console has no critical errors (F12)
- [ ] localStorage shows `token` and `user` after login
- [ ] Can access http://localhost:5000/health

---

## 🔄 Complete Restart Procedure

If nothing else works:

```powershell
# 1. Kill all Node processes
taskkill /F /IM node.exe

# 2. Wait
Start-Sleep -Seconds 3

# 3. Restart backend
cd d:\MEDTECVS\psb6-health-platform\server
npm run dev

# 4. In another terminal, restart frontend
cd d:\MEDTECVS\psb6-health-platform\client
npm start

# 5. Hard refresh browser
# Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

# 6. Try login again
```

---

## 📞 Collecting Debug Info

When asking for help, provide:

1. **Browser Console Error** (F12 → Console)
   ```
   Screenshot or text of red errors
   ```

2. **Backend Log** (from `npm run dev`)
   ```
   Error messages when trying login
   ```

3. **Test API Results**
   ```
   Output from test dashboard
   ```

4. **Which credentials you're using**
   ```
   email: admin@healx.com
   password: Admin@123456
   ```

---

## ✅ Success Indicators

When everything is working:

1. ✅ http://localhost:3000 loads login page
2. ✅ `Test Backend Health` shows status OK
3. ✅ `Test Demo Login` shows success
4. ✅ Demo login button redirects to /dashboard
5. ✅ Dashboard page loads without errors
6. ✅ Browser console has no red errors
7. ✅ localStorage contains token and user

---

## 🎯 Next Steps

If diagnosis shows specific issue:

1. **Backend Down**: Restart with `npm run dev`
2. **Missing Files**: Check all files exist, recreate if needed
3. **Routes Not Loaded**: Verify auth.js routes imported in server.js
4. **Dashboard Error**: Check App.js and Dashboard.js have no syntax errors

---

## MongoDB Setup (Permanent Fix)

For full functionality without demo mode:

1. Create MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Update `server/.env` with connection string
4. Run `npm run seed`
5. Restart backend
6. Login will use real database

---

**Still stuck? Run these commands and share results:**

```powershell
# 1. Check services
netstat -ano | Select-String "3000|5000|8000"

# 2. Check .env
Get-Content server\.env

# 3. Test backend
Invoke-WebRequest -Uri http://localhost:5000/health

# 4. Check logs
# Look at npm run dev output in backend terminal
```
