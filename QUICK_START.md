# QUICK START GUIDE

## For Windows Users

### 1. Prerequisites
- Download & install Node.js 18+ from nodejs.org
- Download & install Python 3.9+ from python.org
- Download & install MongoDB from mongodb.com
- Download & install Git from git-scm.com

### 2. Clone Repository
```bash
git clone <repository-url>
cd psb6-health-platform
```

### 3. Run Setup Script
Double-click `setup.bat` to automatically install all dependencies.

### 4. Start Services

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

**Terminal 3 - AI Service:**
```bash
cd ai-service
python -m venv venv
venv\Scripts\activate.bat
python main.py
```

### 5. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- AI Service: http://localhost:8000

### 6. Login with Demo Account
- Email: `admin@healx.com`
- Password: `Admin@123456`

---

## For Mac/Linux Users

### 1. Prerequisites
```bash
# Install Node.js (using Homebrew on Mac)
brew install node

# Install Python
brew install python3

# Install MongoDB
brew install mongodb-community

# Or use Docker instead:
docker run -d -p 27017:27017 --name mongodb mongo
```

### 2. Clone Repository
```bash
git clone <repository-url>
cd psb6-health-platform
```

### 3. Run Setup Script
```bash
chmod +x setup.sh
./setup.sh
```

### 4. Start Services

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

**Terminal 3 - AI Service:**
```bash
cd ai-service
python3 -m venv venv
source venv/bin/activate
python3 main.py
```

### 5. Access Application
Same as Windows (see above)

---

## Docker Setup (All Platforms)

### Prerequisites
- Docker Desktop installed
- 4GB+ RAM allocated to Docker

### Steps
```bash
# Navigate to project
cd psb6-health-platform

# Start all services
docker-compose up --build

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# MongoDB: mongodb://localhost:27017
# AI Service: http://localhost:8000

# Stop services
docker-compose down
```

---

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
# Windows: Services > MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Test connection
mongosh
```

### Node Modules Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### Python Virtual Environment Issues
```bash
# Remove venv and recreate
rm -rf venv
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### Port 3000 Already in Use
The frontend uses port 3000 by default. If it's in use, the app will ask to use another port.

### React Build Fails
```bash
cd client
npm cache clean --force
rm -rf node_modules
npm install
npm start
```

---

## Demo Features to Try

1. **Emergency SOS**
   - Navigate to Emergency page
   - Fill symptoms and vitals
   - Click "SEND EMERGENCY ALERT"
   - Watch real-time ambulance assignment

2. **Dashboard**
   - View emergency statistics
   - Check ambulance availability
   - Monitor trends

3. **Health Camps**
   - Browse available camps
   - Register for a camp
   - View camp details

4. **Medical Records**
   - View patient medical history
   - Check prescriptions and test results

5. **Real-time Tracking**
   - See ambulance locations on map
   - Monitor emergency progress

6. **AI Predictions**
   - AI-powered severity classification
   - Disease prediction based on symptoms

---

## File Structure

```
psb6-health-platform/
├── server/                    # Backend
│   ├── models/               # Database schemas
│   ├── controllers/          # Business logic
│   ├── routes/              # API endpoints
│   ├── middleware/          # Auth, validation
│   ├── server.js            # Main file
│   └── seed.js              # Demo data
│
├── client/                   # React Frontend
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── api/            # API client
│   │   ├── context/        # State management
│   │   └── App.js          # Main component
│   └── public/
│
├── ai-service/              # Python AI
│   └── main.py              # FastAPI app
│
├── docker-compose.yml       # Docker config
└── README.md               # Documentation
```

---

## Default Credentials

### Admin
- Email: admin@healx.com
- Password: Admin@123456

### Doctor
- Email: doctor1@healx.com
- Password: Doctor@123456

### Patient
- Email: patient1@healx.com
- Password: Patient@123456

### Ambulance Driver
- Email: driver1@healx.com
- Password: Driver@123456

### Volunteer
- Email: volunteer1@healx.com
- Password: Volunteer@123456

---

## Next Steps

1. Customize branding and colors in Tailwind config
2. Configure Twilio for SMS alerts
3. Set up WhatsApp Business API integration
4. Deploy to production (see DEPLOYMENT.md)
5. Configure SSL certificates
6. Set up monitoring and alerts

---

## Support

For issues:
1. Check logs in each terminal
2. Review error messages in browser console (F12)
3. Check SETUP.md for detailed setup
4. Check API_TESTING.md for API examples

---

Happy coding!
