# HEALX – Free Health Camps and Emergency Services Platform

A comprehensive MERN stack application for managing health camps, emergency services, ambulances, and real-time healthcare operations with AI-powered predictions.

## Features

- Health Camp Management
- Emergency SOS System
- Real-time Ambulance Tracking
- Doctor and Volunteer Management
- Patient Health Records
- AI Disease Prediction
- Emergency Severity Prediction
- Analytics Dashboard
- Map-Based Services
- Notification System
- Admin Dashboard
- AI Triage
- Disease Outbreak Prediction
- Voice Emergency Requests
- SMS & WhatsApp Alerts

## Tech Stack

**Frontend:** React.js, Tailwind CSS, Axios, Chart.js
**Backend:** Node.js, Express.js
**Database:** MongoDB with Mongoose
**Real-time:** Socket.io
**Auth:** JWT + bcrypt
**AI:** Python FastAPI + Scikit-learn
**Deployment:** Docker + Docker Compose

## Quick Start

### Prerequisites
- Node.js >= 14
- Python >= 3.8
- MongoDB >= 4.4
- Docker & Docker Compose

### Development Setup

```bash
# Clone repository
cd psb6-health-platform

# Backend setup
cd server
npm install
cp .env.example .env
npm run seed

# Frontend setup
cd ../client
npm install
cp .env.example .env

# AI Service setup
cd ../ai-service
pip install -r requirements.txt
cp .env.example .env

# Run development servers
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm start

# Terminal 3 - AI Service
cd ai-service && python main.py
```

### Docker Deployment

```bash
docker-compose up --build
```

## Project Structure

```
psb6-health-platform/
├── server/                 # Backend API
├── client/                 # React Frontend
├── ai-service/            # Python FastAPI AI
├── docker/                # Docker configurations
└── README.md
```

## API Documentation

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile

### Health Camps
- GET `/api/camps` - List all camps
- POST `/api/camps` - Create camp (admin)
- PUT `/api/camps/:id` - Update camp
- DELETE `/api/camps/:id` - Delete camp

### Emergencies
- POST `/api/emergencies` - Create emergency
- GET `/api/emergencies` - Get emergencies
- PUT `/api/emergencies/:id/status` - Update status

### Ambulances
- GET `/api/ambulances` - List ambulances
- PUT `/api/ambulances/:id/location` - Update location
- PUT `/api/ambulances/:id/status` - Update status

### Dashboard
- GET `/api/dashboard/stats` - Get analytics
- GET `/api/dashboard/heatmap` - Get emergency heatmap

### AI Predictions
- POST `/api/ai/predict-disease` - Disease prediction
- POST `/api/ai/predict-severity` - Severity prediction
- POST `/api/ai/health-score` - Health risk score
- POST `/api/ai/chat` - Medical chatbot

## Real-time Events (Socket.io)

- `ambulance:move` - Ambulance location update
- `emergency:update` - Emergency status update
- `notification:send` - Send notification
- `dashboard:refresh` - Dashboard data update

## Default Admin Credentials

Email: `admin@healx.com`
Password: `Admin@123456`

## License

MIT
