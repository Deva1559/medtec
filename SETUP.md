# HEALX Health Platform - Setup Instructions

## Quick Start (Development Mode)

### Prerequisites
- Node.js v18+
- Python 3.9+
- MongoDB 4.4+
- Git

### Step 1: Clone & Navigate
```bash
cd psb6-health-platform
```

### Step 2: Backend Setup
```bash
cd server
npm install
cp .env.example .env
npm run seed
npm run dev
```

### Step 3: Frontend Setup (New Terminal)
```bash
cd client
npm install
cp .env.example .env
npm start
```

### Step 4: AI Service Setup (New Terminal)
```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Default Credentials
- Email: `admin@healx.com`
- Password: `Admin@123456`

## Docker Deployment

### Prerequisites
- Docker
- Docker Compose

### Run Full Stack
```bash
docker-compose up --build
```

Access the application:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- AI Service: http://localhost:8000
- MongoDB: mongodb://localhost:27017

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile

### Emergencies
- POST `/api/emergencies` - Create emergency SOS
- GET `/api/emergencies` - Get all emergencies
- PUT `/api/emergencies/:id/status` - Update emergency status

### Health Camps
- GET `/api/camps` - List health camps
- POST `/api/camps` - Create health camp (admin)
- POST `/api/camps/:id/register` - Register for camp

### Ambulances
- GET `/api/ambulances` - List ambulances
- PUT `/api/ambulances/:id/location` - Update ambulance location
- PUT `/api/ambulances/:id/status` - Update status

### Dashboard
- GET `/api/dashboard/stats` - Get statistics
- GET `/api/dashboard/heatmap` - Get emergency heatmap

## Real-time Features (Socket.io)

- `ambulance:move` - Live ambulance tracking
- `emergency:update` - Emergency status updates
- `notification:send` - Push notifications
- `dashboard:refresh` - Dashboard data updates

## AI Service Endpoints

- POST `/api/predict-severity` - Predict emergency severity
- POST `/api/predict-disease` - Disease prediction
- POST `/api/health-score` - Calculate health risk score
- POST `/api/chat` - Medical chatbot
- POST `/api/outbreak-prediction` - Disease outbreak prediction
- POST `/api/triage` - AI triage system

## Features Included

✅ User Authentication (JWT + bcrypt)
✅ Health Camp Management
✅ Emergency SOS System
✅ Real-time Ambulance Tracking
✅ Medical Records Management
✅ AI Disease & Severity Prediction
✅ Analytics Dashboard
✅ Geolocation Services
✅ Notifications System
✅ Role-Based Access Control
✅ Volunteer Management
✅ Mock Data Generator

## Troubleshooting

### MongoDB Connection Error
```
MONGODB_URI=mongodb://localhost:27017/healx
```

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: React uses 3000 by default
- AI Service: Change in main.py

### Module Not Found
```bash
# Backend
npm install

# Frontend
npm install

# AI Service
pip install -r requirements.txt
```

## Project Structure

```
psb6-health-platform/
├── server/
│   ├── models/           # MongoDB schemas
│   ├── controllers/      # Business logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth, validation
│   ├── utils/           # Utility functions
│   ├── server.js        # Main server file
│   └── seed.js          # Database seeding
├── client/
│   ├── src/
│   │   ├── api/         # API client
│   │   ├── pages/       # React pages
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Context API
│   │   └── App.js       # Main app
│   └── public/
├── ai-service/
│   ├── main.py          # FastAPI app
│   └── requirements.txt
└── docker-compose.yml
```

## Performance Considerations

- MongoDB indexes on frequently queried fields
- Socket.io for real-time updates
- API response caching
- Geospatial queries for location-based features
- Scalable to 100k+ users

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation
- CORS enabled
- Rate limiting (backend)

## Next Steps

1. Configure external services (Twilio, WhatsApp API)
2. Setup email notifications
3. Implement voice call system
4. Deploy to production
5. Setup SSL certificates
6. Configure load balancing

## Support

For issues or questions, check:
- Backend logs: `npm run dev`
- Frontend console: Browser DevTools
- AI Service logs: Terminal output
