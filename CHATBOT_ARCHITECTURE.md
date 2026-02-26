# Chatbot System Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Chatbot.js Component                                  │   │
│  │  ├─ Chat UI (glassmorphic design)                     │   │
│  │  ├─ Message input & send                              │   │
│  │  ├─ Conversation history display                      │   │
│  │  ├─ Health summary sidebar                            │   │
│  │  └─ Typing indicators & animations                    │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTP/REST
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│              BACKEND (Express.js/Node.js)                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  chatbotController.js                                  │   │
│  │  ├─ sendMessage()      ← User message in              │   │
│  │  │   ├─ buildPatientContext()  ← Load medical data    │   │
│  │  │   ├─ Query MongoDB for patient records             │   │
│  │  │   ├─ Build personalized prompt                     │   │
│  │  │   ├─ Call Gemini API                               │   │
│  │  │   ├─ Store message in history                      │   │
│  │  │   └─ Return AI response → User message out         │   │
│  │  ├─ getHistory()       ← Return past messages         │   │
│  │  ├─ clearHistory()     ← Reset conversation           │   │
│  │  └─ getHealthSummary() ← Get patient data summary     │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  chatbot.js Routes                                      │   │
│  │  POST   /api/chatbot/message         (auth required)   │   │
│  │  GET    /api/chatbot/history         (auth required)   │   │
│  │  DELETE /api/chatbot/history         (auth required)   │   │
│  │  GET    /api/chatbot/health-summary  (auth required)   │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────┬──────────────────────────┬──────────────────────────┘
           │                          │
        (Local)                    (External API)
        Memory Map                    │
        (History)                     │
           │                          ▼
           │                   ┌──────────────────────┐
           │                   │  Google Gemini API   │
           │                   └──────────────────────┘
           │
           └► conversationHistories Map
               └─ {patientId: [{role, parts}, ...]}
```

## Data Flow: User Message to AI Response

```
1. FRONTEND
   ┌─────────────────────────────────────────┐
   │ User types message in chat               │
   │ "I've been feeling very tired"           │
   └────────────┬────────────────────────────┘
                │
                ▼
   ┌─────────────────────────────────────────┐
   │ Send POST /api/chatbot/message           │
   │ Body: { message: "..." }                 │
   │ Auth: JWT Token (with user.id)           │
   └────────────┬────────────────────────────┘
                │
                ▼
2. BACKEND

   ┌─────────────────────────────────────────┐
   │ Received message at POST /api/chatbot... │
   │ Verified: req.user.id = ABISHEK's ID   │
   └────────────┬────────────────────────────┘
                │
                ▼
   ┌─────────────────────────────────────────┐
   │ buildPatientContext(patientId)           │
   │ ├─ SELECT FROM User                     │
   │ │  WHERE _id = ABISHEK_ID               │
   │ └─ Result: {                            │
   │     firstName: "ABISHEK",               │
   │     lastName: "Kumar",                   │
   │     email: "abishek@healx.com",        │
   │     phone: "9876543218",                │
   │     address: {...}                      │
   │   }                                      │
   └────────────┬────────────────────────────┘
                │
                ▼
   ┌─────────────────────────────────────────┐
   │ SELECT FROM MedicalRecord                │
   │ WHERE patient = ABISHEK_ID              │
   │ ORDER BY createdAt DESC LIMIT 10        │
   │ Result: [                               │
   │   {                                      │
   │     recordType: "diagnosis",             │
   │     diagnosis: "Type 2 Diabetes",        │
   │     symptoms: ["Fatigue", "..."],       │
   │     prescription: [{                     │
   │       medicine: "Metformin",             │
   │       dosage: "500mg",                   │
   │       frequency: "twice daily"           │
   │     }],                                  │
   │     vitals: {                            │
   │       bloodPressure: "140/90",           │
   │       heartRate: 78                      │
   │     }                                    │
   │   },                                     │
   │   ... (more records)                     │
   │ ]                                        │
   └────────────┬────────────────────────────┘
                │
                ▼
   ┌─────────────────────────────────────────┐
   │ Build Prompt Context:                    │
   │                                          │
   │ "Patient Information:                    │
   │  Name: ABISHEK Kumar                     │
   │  Email: abishek@healx.com               │
   │  Phone: 9876543218                       │
   │                                          │
   │  === MEDICAL RECORDS ===                 │
   │                                          │
   │  Recent Diagnoses:                       │
   │  1. Type 2 Diabetes                      │
   │     Symptoms: Fatigue                    │
   │                                          │
   │  Current Medications:                    │
   │  1. Metformin 500mg twice daily          │
   │                                          │
   │  Latest Vitals:                          │
   │  - Blood Pressure: 140/90 mmHg           │
   │  - Heart Rate: 78 bpm                    │
   │  - Weight: 82 kg                         │
   │                                          │
   │  === CHATBOT INSTRUCTIONS ===            │
   │  Provide personalized health advice..."  │
   └────────────┬────────────────────────────┘
                │
                ▼
   ┌─────────────────────────────────────────┐
   │ Combine with user message:               │
   │ "Patient info: [context above]           │
   │                                          │
   │  User Message: I've been feeling         │
   │  very tired"                             │
   └────────────┬────────────────────────────┘
                │
                ▼
   ┌─────────────────────────────────────────┐
   │ Combine with conversation history:       │
   │ [{                                       │
   │   role: "user",                          │
   │   parts: [{text: "previous message"}]    │
   │ },                                       │
   │ {                                        │
   │   role: "model",                         │
   │   parts: [{text: "previous response"}]   │
   │ },                                       │
   │ {                                        │
   │   role: "user",                          │
   │   parts: [{text: current_message}]       │
   │ }]                                       │
   └────────────┬────────────────────────────┘
                │
                ▼
3. GEMINI API
   ┌─────────────────────────────────────────┐
   │ genAI.getGenerativeModel(                │
   │   {model: 'gemini-pro'}                  │
   │ ).startChat({history: [...]})            │
   │ .sendMessage(message)                    │
   └────────────┬────────────────────────────┘
                │
                ▼ (Network Request)
   ┌─────────────────────────────────────────┐
   │ Google's Gemini Model                    │
   │ ├─ Reads patient context                 │
   │ │  "This patient has Type 2 Diabetes"    │
   │ ├─ Reads current vitals                  │
   │ │  "BP: 140/90, HR: 78 bpm"              │
   │ ├─ Reads medications                     │
   │ │  "On Metformin 500mg twice daily"      │
   │ ├─ Reads user message                    │
   │ │  "I've been very tired"                │
   │ ├─ Analyze                               │
   │ │  "Fatigue is common symptom of         │
   │ │   diabetes and can indicate            │
   │ │   suboptimal glucose control"          │
   │ └─ Generate response                     │
   │    "Based on your Type 2 Diabetes...     │
   │     and current Metformin therapy,       │
   │     fatigue could indicate..."           │
   └────────────┬────────────────────────────┘
                │
                ▼ (Response)
4. BACKEND (Continued)
   ┌─────────────────────────────────────────┐
   │ AI Response received:                    │
   │ "Based on your Type 2 Diabetes...        │
   │  your fatigue could be related to        │
   │  blood sugar control. Your last          │
   │  reading showed need for management.     │
   │  Recommend checking blood sugar          │
   │  levels and consulting your doctor       │
   │  if fatigue persists. Consider..."       │
   └────────────┬────────────────────────────┘
                │
                ▼
   ┌─────────────────────────────────────────┐
   │ Store in conversation history:           │
   │ conversationHistories.get(ABISHEK_ID)   │
   │ .push({                                  │
   │   role: "user",                          │
   │   parts: [{text: "I'm very tired"}]      │
   │ })                                       │
   │ .push({                                  │
   │   role: "model",                         │
   │   parts: [{text: AI Response}]           │
   │ })                                       │
   │                                          │
   │ Max 40 messages total (20 exchanges)     │
   └────────────┬────────────────────────────┘
                │
                ▼
   ┌─────────────────────────────────────────┐
   │ Return JSON response:                    │
   │ {                                        │
   │   "success": true,                       │
   │   "message": "Based on your Type 2...",  │
   │   "metadata": {                          │
   │     "patientName": "ABISHEK Kumar",     │
   │     "timestamp": "2024-02-26T10:30:00Z" │
   │   }                                      │
   │ }                                        │
   └────────────┬────────────────────────────┘
                │
                ▼
5. FRONTEND
   ┌─────────────────────────────────────────┐
   │ Receive JSON response                    │
   │ Extract: data.message                    │
   │ "Based on your Type 2 Diabetes..."       │
   └────────────┬────────────────────────────┘
                │
                ▼
   ┌─────────────────────────────────────────┐
   │ Add to messages state:                   │
   │ setMessages(prev => [...prev, {          │
   │   role: 'model',                         │
   │   content: AI Response,                  │
   │   timestamp: new Date()                  │
   │ }])                                      │
   └────────────┬────────────────────────────┘
                │
                ▼
   ┌─────────────────────────────────────────┐
   │ Display AI message in chat UI             │
   │ with smooth animation                    │
   │                                          │
   │ [Chat Bubble with AI Response]           │
   │ "Based on your Type 2 Diabetes..."       │
   └─────────────────────────────────────────┘
```

## Database Schema & Queries

### User Collection (MongoDB)

```javascript
{
  _id: ObjectId,
  firstName: "ABISHEK",
  lastName: "Kumar",
  email: "abishek@healx.com",
  password: "bcrypt_hashed_password",
  phone: "9876543218",
  role: "patient",
  address: {
    street: "Rajiv Chowk",
    city: "Delhi",
    state: "Delhi",
    country: "India"
  },
  location: {
    type: "Point",
    coordinates: [77.2197, 28.6328]
  }
}
```

Query: `User.findById(patientId)`

### MedicalRecord Collection (MongoDB)

```javascript
[
  {
    _id: ObjectId,
    patient: ObjectId(ABISHEK),
    doctor: ObjectId(doctor),
    recordType: "diagnosis",
    diagnosis: "Type 2 Diabetes",
    symptoms: ["Increased thirst", "Fatigue"],
    prescription: [{
      medicine: "Metformin",
      dosage: "500mg",
      frequency: "twice daily",
      duration: "ongoing"
    }],
    vitals: {
      heartRate: 78,
      bloodPressure: "140/90",
      weight: 82,
      height: 175,
      bmi: 28.5
    },
    labTests: [{
      testName: "Blood Sugar",
      result: "145",
      unit: "mg/dL",
      abnormal: true
    }],
    allergies: ["Penicillin"],
    treatmentPlan: "Medication and diet control",
    createdAt: ISODate("2024-02-15"),
    updatedAt: ISODate("2024-02-15")
  },
  ... (more records)
]
```

Query: `MedicalRecord.find({patient: patientId}).sort({createdAt: -1}).limit(10)`

## In-Memory Data Structure

### Conversation History Map

```javascript
conversationHistories Map = {
  "ObjectId(ABISHEK)": [
    {
      role: "user",
      parts: [{text: "How can I manage my diabetes?"}]
    },
    {
      role: "model",
      parts: [{text: "Based on your Type 2 Diabetes and Metformin therapy..."}]
    },
    {
      role: "user",
      parts: [{text: "I've been feeling tired"}]
    },
    {
      role: "model",
      parts: [{text: "Fatigue is common with diabetes..."}]
    }
    // ... max 40 messages (20 exchanges)
  ],
  
  "ObjectId(DEVARANJAN)": [
    // Different conversation for different patient
  ],
  
  "ObjectId(HARINI)": [
    // Yet another conversation
  ]
}
```

## API Response Examples

### sendMessage Response

```json
{
  "success": true,
  "message": "Based on your Type 2 Diabetes diagnosis and current Metformin therapy at 500mg twice daily, fatigue can be related to blood sugar control. Your recent blood pressure reading of 140/90 indicates stable hypertension management with Lisinopril. I recommend checking your fasting blood sugar levels and consulting your doctor if fatigue persists. Consider adding regular light exercise to improve diabetes management.",
  "metadata": {
    "patientName": "ABISHEK Kumar",
    "timestamp": "2024-02-26T10:30:00.000Z",
    "messageLength": 378
  }
}
```

### getHealthSummary Response

```json
{
  "success": true,
  "summary": {
    "patientName": "ABISHEK Kumar",
    "recentDiagnoses": [
      {
        "diagnosis": "Type 2 Diabetes",
        "date": "2024-02-15T00:00:00.000Z"
      },
      {
        "diagnosis": "Hypertension",
        "date": "2024-02-10T00:00:00.000Z"
      }
    ],
    "currentMedications": [
      "Metformin",
      "Lisinopril"
    ],
    "latestVitals": {
      "heartRate": 78,
      "bloodPressure": "140/90",
      "temperature": 37.2,
      "weight": 82,
      "height": 175,
      "bmi": 28.5,
      "oxygenLevel": 98
    },
    "allergies": [
      "Penicillin",
      "Aspirin"
    ],
    "medicalHistory": []
  }
}
```

## Security Flow

```
1. Patient logs in
   ├─ Email: abishek@healx.com
   ├─ Password: patient1@123
   └─ Backend verifies bcrypt hash

2. JWT Token generated
   ├─ Header: {typ: "JWT", alg: "HS256"}
   ├─ Payload: {userId: ObjectId, isDemo: false}
   └─ Signature: HMAC-SHA256

3. Frontend stores JWT in localStorage
   └─ Used in Authorization: Bearer TOKEN

4. Patient requests /api/chatbot/message
   ├─ Auth middleware verifies JWT
   ├─ Extracts req.user._id
   ├─ Verification: req.user.role === 'patient'
   ├─ Loads ONLY that patient's medical data
   └─ Ensures data isolation

5. Gemini API called
   ├─ Only receives patient's own data
   ├─ No other patient data included
   └─ Response stays in patient's conversation history
```

## Performance Considerations

```
┌─────────────────────────────────────────┐
│ Database Queries (per message)          │
├─────────────────────────────────────────┤
│ 1. User.findById()          - O(1)      │
│ 2. MedicalRecord.find()     - O(n)      │
│    Limit: 10 records max                │
│ 3. Build context            - O(n)      │
│    String concatenation                 │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ API Calls (per message)                 │
├─────────────────────────────────────────┤
│ 1. Gemini API               - ~2-3 sec  │
│ 2. Return response          - ~100ms    │
│                                          │
│ Total latency: ~2.5-3 seconds           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Storage (per patient)                   │
├─────────────────────────────────────────┤
│ Conversation history: Last 20 exchanges │
│ ~40 messages max per patient            │
│ In-memory storage ~ 50-100KB per patient│
└─────────────────────────────────────────┘
```

This architecture ensures personalization by including patient-specific medical data in every AI request!
