# MongoDB Setup Options

## Option 1: MongoDB Atlas (RECOMMENDED - Fastest for Development)

MongoDB Atlas is a cloud-hosted MongoDB service with a free tier perfect for development.

### Steps to Set Up:

1. **Create Free Account**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Click "Try Free"
   - Sign up with email and password
   - Verify email

2. **Create a Cluster**
   - Select "Build a Cluster"
   - Choose "Shared Clusters" (FREE tier)
   - Click "Create" 
   - Select region: "Singapore" or "N. Virginia" (or closest to you)
   - Click "Create Cluster" (takes ~5 minutes)

3. **Get Connection String**
   - Once cluster is created, click "Connect"
   - Select "Nodejs" driver
   - Copy the connection string
   - Replace <username> and <password> with your credentials
   - Example: `mongodb+srv://admin:password@cluster.mongodb.net/healx`

4. **Update .env File**
   ```
   cd d:\MEDTECVS\psb6-health-platform\server
   # Edit .env file and replace MONGODB_URI with your connection string
   ```

5. **Seed Database and Restart**
   ```powershell
   cd server
   npm run seed
   Stop-Job -Name backend
   npm run dev
   ```

**Time Required:** 5-10 minutes
**Cost:** FREE for development
**Best For:** Quick testing without local setup

---

## Option 2: Local MongoDB Installation (Manual Download)

### Steps:

1. **Download MongoDB**
   - Go to: https://www.mongodb.com/try/download/community
   - Select version: Latest (currently 8.2.5)
   - Platform: Windows x64
   - Download MSI installer

2. **Install MongoDB**
   - Run the MSI installer
   - Select "Install MongoDB as a Service" during setup
   - Choose install path (default C:\Program Files\MongoDB\Server\8.2)
   - Complete installation

3. **Start MongoDB Service**
   ```powershell
   Start-Service mongod
   # Or in Services app: Services > mongod > Right-click > Start
   ```

4. **Verify Installation**
   ```powershell
   mongosh  # Should connect to localhost:27017
   ```

5. **Seed Database**
   ```powershell
   cd d:\MEDTECVS\psb6-health-platform\server
   npm run seed
   ```

6. **Restart Backend**
   ```powershell
   Stop-Job -Name backend
   npm run dev
   ```

**Time Required:** 10-15 minutes
**Cost:** FREE
**Best For:** Full local development without internet dependency

---

## Option 3: MongoDB via Docker (If Docker is available)

```powershell
docker run -d -p 27017:27017 --name mongodb -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=admin123 mongo

# Then update .env:
   # MONGODB_URI=mongodb://admin:admin123@localhost:27017/healx
```

---

## Quick Status Check

If any option is already set up, test with:

```powershell
mongosh
# Or
mongo

# Then type: db.version()
```

---

## RECOMMENDED QUICK FIX

Use **MongoDB Atlas** (Option 1) - Takes only 5 minutes and requires no local admin rights!

After account creation, paste your connection string here and I'll update your .env automatically.
