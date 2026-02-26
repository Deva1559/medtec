# URGENT: Fix MongoDB Connection Issue

## Error Explanation
```
Operation `users.findOne()` buffering timed out after 10000ms
```
This means: **Your backend tried to query MongoDB but couldn't find it**

---

## FASTEST SOLUTION: MongoDB Atlas (5 minutes)

### Step-by-Step:

#### 1️⃣ Create Free Atlas Account (2 minutes)
```
URL: https://www.mongodb.com/cloud/atlas
- Click "Try Free"
- Sign up with your email
- Verify email in inbox
```

#### 2️⃣ Create Free Cluster (3 minutes)
```
- Click "Create a Deployment"
- Select "Shared" (FREE)
- Click "Create Shared Cluster"
- Wait 5 minutes for cluster to initialize
```

#### 3️⃣ Get Connection String (1 minute)
```
- Click "Connect"
- Choose "Drivers" → "Node.js" 
- Copy the connection string
- Replace <username> and <password>

EXAMPLE CONNECTION STRING:
mongodb+srv://admin:your_password@cluster0.abcde.mongodb.net/psb6?retryWrites=true&w=majority
```

#### 4️⃣ Update Your .env File
```powershell
# Open file: d:\MEDTECVS\psb6-health-platform\server\.env

# Replace this line:
MONGODB_URI=mongodb://localhost:27017/healx

# With your Atlas connection string:
MONGODB_URI=mongodb+srv://admin:your_password@cluster0.abcde.mongodb.net/healx?retryWrites=true&w=majority
```

#### 5️⃣ Seed Demo Data
```powershell
cd d:\MEDTECVS\psb6-health-platform\server
npm run seed
```

#### 6️⃣ Restart Backend
```powershell
# Stop current backend
Stop-Job -Name backend

# Wait 2 seconds
Start-Sleep -Seconds 2

# Start backend
cd d:\MEDTECVS\psb6-health-platform\server
npm run dev
```

#### 7️⃣ Refresh Browser
```
http://localhost:3000
Try login again with:
  Email: admin@healx.com
  Password: Admin@123456
```

---

## Why MongoDB Atlas?
✅ No admin rights needed
✅ No local installation
✅ Free tier available (512 MB storage)
✅ Takes 5 minutes
✅ Perfect for testing
✅ Can access from anywhere

---

## Alternative: Local MongoDB (Requires Admin)

If you can get admin elevated shell:

```powershell
# Download from: https://www.mongodb.com/try/download/community
# Run MSI installer as Administrator
# Start service: Start-Service mongod
# Seed database: npm run seed
```

---

## Current Issue
❌ MONGODB_URI points to localhost:27017
❌ MongoDB not running locally
❌ Backend can't connect
❌ Login fails with timeout

## After Atlas Setup
✅ MONGODB_URI points to cloud
✅ Backend connects successfully
✅ Data persists safely
✅ Login works instantly

---

## Submit Your Connection String Below
Once you create your Atlas cluster and get the connection string:

1. Post the string here
2. I'll update your .env automatically
3. Restart the services
4. You'll be able to login immediately

**Your Atlas Connection String (from step 3):**
```
mongodb+srv://[username]:[password]@cluster0.[id].mongodb.net/psb6?retryWrites=true&w=majority
```

Replace `[username]`, `[password]`, and `[id]` with your actual values.

---

⏱️ **Total Time: 5-10 minutes to full functionality**
