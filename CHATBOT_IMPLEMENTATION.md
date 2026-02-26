# 🤖 Health Assistant Chatbot - Complete Implementation

## What Was Created

A fully functional **personalized health assistant chatbot** powered by Google Gemini API that provides different responses for each patient based on their unique medical data.

### Backend Components

**File:** `server/controllers/chatbotController.js`
- Fetches patient's medical records (diagnoses, medications, vitals, lab tests)
- Builds personalized context from patient data
- Sends context + user message to Gemini API
- Manages conversation history (last 20 exchanges)
- Provides health summary endpoint

**File:** `server/routes/chatbot.js`
- `POST /api/chatbot/message` - Send message to chatbot
- `GET /api/chatbot/history` - Get conversation history
- `DELETE /api/chatbot/history` - Clear history
- `GET /api/chatbot/health-summary` - Get health summary

**File:** `server/server.js`
- Added chatbot routes to API
- Registered endpoints

**File:** `server/.env`
- Added `GEMINI_API_KEY` configuration

**File:** `server/package.json`
- Added `@google/generative-ai` dependency

### Frontend Components

**File:** `client/src/components/Chatbot.js`
- React component for chat interface
- Real-time message handling
- Health summary sidebar
- Conversation history display
- Typing indicators and animations
- Error handling

**File:** `client/src/components/Chatbot.css`
- Glassmorphic design (modern dark theme)
- Smooth animations and transitions
- Responsive mobile layout
- Custom scrollbars

**File:** `client/src/App.js`
- Added chatbot import
- Added `/chatbot` route (patient-only)
- Added "Health Assistant" nav link (appears for patients)

### Documentation

**File:** `CHATBOT_README.md` - Complete technical documentation
**File:** `CHATBOT_SETUP.md` - Quick start guide

---

## 🚀 How to Use (Step by Step)

### Step 1: Get Gemini API Key

1. Visit: https://aistudio.google.com/app/apikey
2. Click "Create API key"
3. Copy the key

### Step 2: Configure Backend

Edit `server/.env`:

```env
GEMINI_API_KEY=AIzaSyD... (your key here)
```

### Step 3: Install Package

```bash
cd server
npm install @google/generative-ai
```

Done! ✅

### Step 4: Start Services

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

Backend: http://localhost:5000
Frontend: http://localhost:3000

### Step 5: Test It

1. Log in as patient: `abishek@healx.com` / `patient1@123`
2. Click **"🤖 Health Assistant"** in nav
3. Send a message: "How can I manage my diabetes?"
4. AI responds with **personalized** advice! 🎉

---

## 🎯 Personalization Features

Each patient gets **unique responses** based on their medical profile:

### Patient 1: ABISHEK
- **Diagnoses:** Hypertension, Type 2 Diabetes
- **Medications:** Lisinopril 10mg, Metformin 500mg
- **Vitals:** BP 140/90, HR 78, Weight 82kg

**Q:** "Should I exercise?"
**A:** "Yes! Given your type 2 diabetes and elevated BP at 140/90, start with 30 minutes of moderate activity like walking. Avoid intense workouts without doctor approval. Your medication is Metformin, which works well with regular exercise..."

### Patient 2: DEVARANJAN
- **Different medical profile**
- **Different conditions**

**Same Q:** "Should I exercise?"
**Different A:** "Based on your specific conditions and medications, here's what I recommend..."

### Patient 3: HARINI
- **Different diagnoses**
- **Different medications**

**Same Q:** "Should I exercise?"
**Yet Another A:** "Considering your medical history and current vitals..."

---

## 📚 API Endpoints

### Send Message
```bash
POST /api/chatbot/message
Authorization: Bearer JWT_TOKEN
Body: { "message": "Your question" }

Response:
{
  "success": true,
  "message": "AI response here...",
  "metadata": {
    "patientName": "ABISHEK Kumar",
    "timestamp": "2024-02-26T10:30:00Z"
  }
}
```

### Get Health Summary
```bash
GET /api/chatbot/health-summary
Authorization: Bearer JWT_TOKEN

Response:
{
  "success": true,
  "summary": {
    "patientName": "ABISHEK Kumar",
    "recentDiagnoses": [...],
    "currentMedications": [...],
    "latestVitals": {...},
    "allergies": [...]
  }
}
```

### Get Conversation History
```bash
GET /api/chatbot/history
Authorization: Bearer JWT_TOKEN

Response:
{
  "success": true,
  "history": [...],
  "count": 5  // 5 exchanges (10 messages)
}
```

### Clear History
```bash
DELETE /api/chatbot/history
Authorization: Bearer JWT_TOKEN

Response:
{
  "success": true,
  "message": "Conversation history cleared"
}
```

---

## 🔄 How Personalization Works

### Flow Diagram

```
1. Patient logs in as ABISHEK
                 ↓
2. Patient clicks "Health Assistant"
                 ↓
3. Patient types: "I feel dizzy"
                 ↓
4. Backend receives message
                 ↓
5. Fetch ABISHEK's medical records from MongoDB:
   - Diagnoses: Hypertension, Type 2 Diabetes
   - Medications: Lisinopril 10mg, Metformin 500mg
   - Vitals: BP 140/90, HR 78, Weight 82kg
   - Allergies: Penicillin
                 ↓
6. Build context with all this data
                 ↓
7. Send to Gemini: "Given this patient profile, respond to: 'I feel dizzy'"
                 ↓
8. Gemini AI processes:
   - Patient has hypertension and takes BP medication
   - Dizziness can be related to BP control
   - Should refer to their specific condition
                 ↓
9. Returns personalized response:
   "Dizziness with your hypertension and current BP reading of 140/90
    could be related to your Lisinopril. This is important to discuss
    with your doctor..."
                 ↓
10. Response displayed in chat UI ✅
```

### Data Included in Context

For each patient message:

**Patient Info:**
- Name, email, phone, address

**Medical Records (Last 10, Most Recent First):**

1. **Recent Diagnoses** (last 3)
   - Diagnosis name
   - Date
   - Symptoms
   - Treatment plan

2. **Current Medications**
   - Medicine name
   - Dosage
   - Frequency
   - Duration
   - Notes

3. **Latest Vitals**
   - Heart rate, blood pressure, temperature
   - Respiration rate, weight, height
   - BMI, oxygen level

4. **Lab Test Results** (last 2 reports)
   - Test names and results
   - Normal vs abnormal indicators

5. **Allergies**
   - All documented allergies

6. **Medical History**
   - Previous conditions

---

## 🎨 Features

✅ **Personalized Responses**
- Each patient gets unique advice based on their data

✅ **Real-Time Chat**
- Live message handling with typing indicators

✅ **Health Summary Sidebar**
- Click ℹ️ to see patient's diagnoses, medications, allergies

✅ **Beautiful UI**
- Glassmorphic dark theme
- Smooth animations
- Responsive design (desktop & mobile)

✅ **Conversation Management**
- View history
- Clear conversation with 🗑️ button
- Auto-scroll to latest message

✅ **Security**
- Patient role required (JWT)
- Per-patient data isolation
- No password access needed

✅ **Error Handling**
- Network errors caught
- API failures handled gracefully
- User-friendly error messages

---

## 🧪 Test Accounts

All have password: `patient1@123`

| Name | Email | Condition |
|------|-------|-----------|
| ABISHEK | abishek@healx.com | Hypertension, Type 2 Diabetes |
| DEVARANJAN | devaranjan@healx.com | Different profile |
| HARINI | harini@healx.com | Different profile |
| BIRUDHA | birudha@healx.com | Different profile |

Try logging in as different patients and ask the same question - get different personalized responses!

---

## 📁 Files Modified/Created

### Created Files

```
✨ server/controllers/chatbotController.js      (New)
✨ server/routes/chatbot.js                     (New)
✨ client/src/components/Chatbot.js             (New)
✨ client/src/components/Chatbot.css            (New)
📖 CHATBOT_README.md                            (New)
📖 CHATBOT_SETUP.md                             (New)
```

### Modified Files

```
🔄 server/server.js                            (Added chatbot routes)
🔄 server/.env                                 (Added GEMINI_API_KEY)
🔄 server/package.json                         (Added @google/generative-ai)
🔄 client/src/App.js                           (Added chatbot route & nav link)
```

---

## ⚙️ Configuration

**Environment Variables Required:**

```env
# In server/.env
GEMINI_API_KEY=AIzaSyD... (your Gemini API key)

# Already configured:
MONGODB_URI=mongodb+srv://...
PORT=5000
JWT_SECRET=...
CLIENT_URL=http://localhost:3000
```

---

## 🔒 Security Features

✅ JWT authentication required
✅ Patient role enforcement
✅ Per-patient data isolation
✅ Conversation history per patient only
✅ No sensitive data in logs
✅ Medical data from secure database

---

## 📊 Conversation Storage

- **Duration:** Session-based (cleared on logout)
- **Storage:** In-memory per patient (Map data structure)
- **Limit:** Last 20 messages per patient (token optimization)
- **Access:** Only the authenticated patient

---

## 🎓 Example: Different Responses

### All patients ask: "What should I eat?"

**ABISHEK (Diabetes + Hypertension):**
```
"For your type 2 diabetes and hypertension, focus on:
- Low sodium (given your BP of 140/90)
- Low glycemic foods (blood sugar management)
- Whole grains, lean proteins, vegetables
Avoid: Processed foods, sugary drinks, salty snacks
Your Metformin works best with consistent eating..."
```

**DEVARANJAN (Different conditions):**
```
"Based on your specific diagnoses and medications...
[Different dietary advice tailored to their profile]"
```

**HARINI (Different medical profile):**
```
"Considering your conditions and current vitals...
[Yet another personalized response]"
```

---

## 🚀 Next Steps (Optional Enhancements)

- [ ] Store conversation history in MongoDB
- [ ] Export conversation as PDF
- [ ] Audio input/output
- [ ] Multi-language support
- [ ] Doctor review of chatbot interactions
- [ ] Health reminders based on conditions
- [ ] Integration with wearable data
- [ ] Appointment scheduling suggestions

---

## 💡 How It Works (Technical Deep Dive)

### 1. Patient Sends Message

Frontend calls:
```javascript
POST /api/chatbot/message
{ message: "How's my blood sugar?" }
```

### 2. Backend Loads Patient Data

```javascript
// Fetch from MongoDB
const patient = await User.findById(patientId)
const medicalRecords = await MedicalRecord.find({ patient: patientId })
```

### 3. Builds Personalized Prompt

```
Patient Information:
Name: ABISHEK Kumar
Email: abishek@healx.com

=== MEDICAL RECORDS ===

Recent Diagnoses:
1. Type 2 Diabetes (2024-02-15)
   Symptoms: Increased thirst, fatigue
   Treatment Plan: Medication and diet control

Current Medications:
1. Metformin 500mg twice daily
2. Lisinopril 10mg daily

Latest Vitals:
- Blood Pressure: 140/90 mmHg
- Heart Rate: 78 bpm
- Weight: 82 kg
- BMI: 28.5

[... more data ...]

=== CHATBOT INSTRUCTIONS ===
Provide health advice specific to this patient...
```

### 4. Calls Gemini API

```javascript
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
const result = await chat.sendMessage(userMessage)
```

### 5. Returns Personalized Response

```json
{
  "message": "Based on your Type 2 Diabetes and current Metformin therapy,
              your blood sugar control depends on consistent medication,
              diet, and exercise. Your last recorded blood pressure
              is 140/90, which indicates good control of hypertension
              with Lisinopril. Regular monitoring and consulting your
              doctor for any changes is important..."
}
```

### 6. Displays in Chat UI

User sees the personalized response with their specific data referenced!

---

## ❓ FAQ

**Q: Will every patient get the same response?**
A: No! Each patient's response is unique because their medical data is included in the AI context.

**Q: What if a patient has no medical records?**
A: The system still works - AI responds based on general health knowledge but indicates it couldn't personalize further.

**Q: Is it secure?**
A: Yes! Only authenticated patients can access, JWT required, per-patient isolation.

**Q: Can doctors see the chatbot?**
A: Currently patients only. Can be extended later for doctors to review patient interactions.

**Q: Where is data stored?**
A: Medical data in MongoDB, conversation history in memory (session-based).

**Q: How many messages can I send?**
A: Unlimited per session. History keeps last 20 exchanges to optimize tokens.

---

## 🎉 You Now Have

✨ A fully functional personalized health chatbot
✨ Different responses for each patient
✨ Beautiful modern UI
✨ Complete API documentation
✨ Setup guides
✨ Security built-in

**Total Setup Time: ~5 minutes** ⏱️

Just add your Gemini API key and you're done!

---

**Enjoy your AI-powered health assistant! 🏥🤖**
