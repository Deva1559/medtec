# HEALX Health Platform - API Testing

## Quick Test Cases

### 1. Authentication

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"John","lastName":"Doe",
    "email":"john@healx.com","password":"Pass@123456",
    "phone":"9876543210","role":"patient"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@healx.com","password":"Admin@123456"}'

# Get Profile (Replace TOKEN)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

### 2. Emergency SOS

```bash
# Create Emergency
curl -X POST http://localhost:5000/api/emergencies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "emergencyType":"cardiac",
    "symptoms":["Chest Pain","Shortness of Breath"],
    "vitals":{
      "heartRate":110,
      "bloodPressure":"160/100",
      "temperature":98.6,
      "oxygenLevel":88
    },
    "location":{
      "type":"Point",
      "coordinates":[28.7041,77.1025]
    },
    "address":"MG Road, Delhi"
  }'

# Get Emergencies
curl -X GET "http://localhost:5000/api/emergencies?status=pending" \
  -H "Authorization: Bearer TOKEN"
```

### 3. Health Camps

```bash
# Get All Camps
curl -X GET http://localhost:5000/api/camps \
  -H "Authorization: Bearer TOKEN"

# Create Camp (Admin only)
curl -X POST http://localhost:5000/api/camps \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name":"Free Health Camp",
    "type":"general",
    "startDate":"2026-03-01T00:00:00Z",
    "endDate":"2026-03-05T00:00:00Z",
    "location":{"type":"Point","coordinates":[28.7041,77.1025]},
    "address":{"city":"Delhi","state":"Delhi"},
    "services":["General Checkup","Blood Test"],
    "capacity":100,
    "budget":50000
  }'

# Register for Camp
curl -X POST http://localhost:5000/api/camps/CAMP_ID/register \
  -H "Authorization: Bearer TOKEN"
```

### 4. Ambulances

```bash
# Get All Ambulances
curl -X GET http://localhost:5000/api/ambulances \
  -H "Authorization: Bearer TOKEN"

# Update Ambulance Location
curl -X PUT http://localhost:5000/api/ambulances/AMB_ID/location \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "longitude":28.7041,
    "latitude":77.1025
  }'

# Update Ambulance Status
curl -X PUT http://localhost:5000/api/ambulances/AMB_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"status":"available"}'
```

### 5. Medical Records

```bash
# Get Patient Records
curl -X GET "http://localhost:5000/api/records?patient=PATIENT_ID" \
  -H "Authorization: Bearer TOKEN"

# Create Record (Doctor)
curl -X POST http://localhost:5000/api/records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "patient":"PATIENT_ID",
    "recordType":"diagnosis",
    "diagnosis":"Hypertension",
    "symptoms":["Headache","Dizziness"],
    "vitals":{"bloodPressure":"140/90"}
  }'
```

### 6. Dashboard

```bash
# Get Statistics
curl -X GET http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer TOKEN"

# Get Emergency Trends
curl -X GET http://localhost:5000/api/dashboard/trends/emergencies \
  -H "Authorization: Bearer TOKEN"

# Get Heatmap
curl -X GET http://localhost:5000/api/dashboard/heatmap \
  -H "Authorization: Bearer TOKEN"
```

### 7. AI Service

```bash
# Predict Severity
curl -X POST http://localhost:8000/api/predict-severity \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms":["Chest Pain","Shortness of Breath"],
    "vitals":{"heartRate":110,"oxygenLevel":88}
  }'

# Predict Disease
curl -X POST http://localhost:8000/api/predict-disease \
  -H "Content-Type: application/json" \
  -d '{"symptoms":["Chest Pain","Fever"]}'

# Health Score
curl -X POST http://localhost:8000/api/health-score \
  -H "Content-Type: application/json" \
  -d '{"vitals":{"heartRate":70,"temperature":98.6}}'

# Medical Chatbot
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"I have a fever"}'
```

## Using Postman

1. Import collection JSON
2. Set TOKEN variable in environment
3. Run requests from collection
4. View responses

## Load Testing

```bash
# Use Apache Bench
ab -n 100 -c 10 http://localhost:5000/health

# Or use wrk
wrk -t4 -c100 -d30s http://localhost:5000/health
```

## WebSocket Testing

```bash
# Using wscat
npm install -g wscat

wscat -c ws://localhost:5000

# Subscribe to events
> {"action":"subscribe","channel":"emergency"}
> {"action":"subscribe","channel":"ambulance:123"}
```
