# Quick Setup: Health Assistant Chatbot

## ⚡ 5-Minute Setup

### Step 1: Get Gemini API Key (2 minutes)

1. Visit: https://aistudio.google.com/app/apikey
2. Click "Create API key"
3. Copy the key (Keep it safe!)

### Step 2: Add API Key to Backend (1 minute)

Edit `/server/.env`:

```env
GEMINI_API_KEY=paste_your_key_here
```

### Step 3: Install Dependency (1 minute)

```bash
cd server
npm install @google/generative-ai
```

### Step 4: Restart Backend (1 minute)

```bash
npm run dev
```

✅ **Done!** The chatbot is now ready.

---

## 🚀 Access the Chatbot

1. Log in as a patient:
   - Email: `abishek@healx.com`
   - Password: `patient1@123`

2. Click **"🤖 Health Assistant"** in navigation

3. Start chatting!

---

## 🎯 What Happens When You Chat

1. **Patient sends message** → "I've been feeling dizzy"

2. **Backend loads patient data** ↓
   - Diagnoses: Hypertension, Type 2 Diabetes
   - Medications: Lisinopril 10mg, Metformin 500mg
   - Vitals: BP 140/90, HR 78 bpm
   - Allergies: Penicillin, Aspirin

3. **Gemini AI processes context** ↓
   - "This patient has high BP, takes BP medication"
   - "Dizziness can be related to their conditions"
   - "Should suggest consulting doctor"

4. **Personalized response** ↓
   - "Dizziness with your blood pressure condition could be related to Lisinopril..."

5. **Message appears in chat** ✓

---

## 📝 Example: Different Responses for Same Query

**All patients ask:** "What should I eat?"

| Patient | Condition | AI Response |
|---------|-----------|------------|
| ABISHEK | Type 2 Diabetes + Hypertension | "Limit sodium and refined sugars..." |
| HARINI | (Different conditions) | "Your specific condition requires..." |
| DEVARANJAN | (Different conditions) | "Based on your medications..." |

Each response is **unique to their medical profile**!

---

## 🔌 API Endpoints

```bash
# Send message (POST)
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Authorization: Bearer TOKEN" \
  -d '{"message":"Your question here"}'

# Get history (GET)
curl http://localhost:5000/api/chatbot/history \
  -H "Authorization: Bearer TOKEN"

# Clear history (DELETE)
curl -X DELETE http://localhost:5000/api/chatbot/history \
  -H "Authorization: Bearer TOKEN"

# Health summary (GET)
curl http://localhost:5000/api/chatbot/health-summary \
  -H "Authorization: Bearer TOKEN"
```

---

## 📊 Features Included

✅ Personalized responses based on each patient's medical data
✅ Access to diagnoses, medications, vitals, and lab results
✅ Conversation history management
✅ Health summary sidebar
✅ Beautiful chat UI with animations
✅ Typing indicators
✅ Error handling
✅ Mobile responsive
✅ Role-based access (patients only)

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "API key not configured" | Add `GEMINI_API_KEY` to `.env` |
| 403 Forbidden | Use patient account, not admin/doctor |
| Slow responses | Check internet, verify Gemini quota |
| Messages not loading | Restart backend: `npm run dev` |

---

## 📱 Test Scenarios

### Scenario 1: Medication Question
**Patient:** "Can I take ibuprofen?"
**AI:** Checks allergies and medication interactions based on their profile
**Response:** Personalized based on their specific situation

### Scenario 2: Symptom Inquiry
**Patient:** "Why am I feeling tired?"
**AI:** References their diagnoses (diabetes, hypertension, etc.)
**Response:** Links fatigue to their condition and medications

### Scenario 3: Diet Advice
**Patient:** "What should I eat?"
**AI:** Considers their conditions and current vitals
**Response:** Personalized dietary recommendations

---

## 🎓 How Personalization Works

```javascript
// Example: Building patient context

Patient Data:
- Name: ABISHEK Kumar
- Diagnosis: Type 2 Diabetes (recent)
- Diagnosis: Hypertension (active)
- Medications: Metformin 500mg, Lisinopril 10mg
- Vitals: BP 140/90, Weight 82kg
- Allergies: Penicillin

User Message:
"Should I exercise daily?"

AI Context:
"This patient has diabetes and hypertension.
Exercise is important but their BP is elevated.
They're on BP medication. Suggest duration
appropriate for their conditions..."

AI Response:
"Yes! Exercise is excellent for both conditions.
Given your BP reading of 140/90, start with
30 minutes of moderate activity (walking, swimming).
Avoid sudden intense workouts. Consult your doctor
about the best exercise routine for you..."
```

---

## 🔒 Security

- Only patients can access
- JWT authentication required
- Each patient sees only their data
- Conversation isolated per patient
- No passwords stored in chat history

---

## ✨ What Makes It Different

### Traditional Chatbot
- Generic responses for all users
- "Exercise is good for everyone"

### HEALX Health Assistant
- **Personalized** responses per patient
- "Given your diabetes and elevated BP, here's your personalized exercise plan..."

---

## 📞 Support

For issues, check:
1. Gemini API quota: https://aistudio.google.com/app/apikey
2. Backend logs: Run `npm run dev` and check console
3. Browser console: Press F12 to see errors

---

**That's it! You now have a personalized health assistant chatbot! 🎉**
