# Personalized Health Assistant Chatbot

A Gemini API-powered chatbot system that provides personalized health advice to patients based on their medical records, diagnoses, medications, vitals, and medical history.

## Features

✨ **Personalized AI Responses**
- Each patient gets unique responses based on their specific medical data
- Context includes recent diagnoses, current medications, vital signs, lab tests, and allergies
- AI considers patient history when providing health guidance

🏥 **Medical Data Integration**
- Automatically fetches patient's:
  - Recent diagnoses and symptoms
  - Current medications and dosages
  - Latest vital signs (heart rate, blood pressure, temperature, etc.)
  - Lab test results
  - Allergies and medical history
  - Emergency contacts

💬 **Conversation Features**
- Real-time chat with Gemini AI
- Conversation history management
- Clear history option
- Health summary sidebar
- Typing indicators

🔒 **Security & Privacy**
- Patient-only access (role-based)
- JWT authentication required
- Per-patient conversation isolation
- No password access to personal data

## Setup Instructions

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API key in new project" or select existing project
3. Copy your API key

### 2. Configure Backend

Add your Gemini API key to `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Backend Structure

**Controller: `/server/controllers/chatbotController.js`**
- `sendMessage(req, res)` - Process patient message and get AI response
- `getHistory(req, res)` - Retrieve conversation history
- `clearHistory(req, res)` - Clear conversation history
- `getHealthSummary(req, res)` - Get patient health data summary

**Routes: `/server/routes/chatbot.js`**
```
POST   /api/chatbot/message          - Send message
GET    /api/chatbot/history          - Get history
DELETE /api/chatbot/history          - Clear history
GET    /api/chatbot/health-summary   - Get health summary
```

**Middleware:**
- `auth` - JWT authentication required
- `requirePatient` - Patient role required

### 4. Frontend Structure

**Component: `/client/src/components/Chatbot.js`**
- Full-page chat interface
- Real-time message handling
- Health summary display
- Typing indicators
- Error handling

**Styles: `/client/src/components/Chatbot.css`**
- Glassmorphic design theme
- Touch-friendly on mobile
- Smooth animations
- Responsive layout

## How It Works

### Patient Context Building

When a patient sends a message:

1. **Patient Profile Loaded**
   - Name, email, phone, address
   - Emergency contacts

2. **Medical Records Retrieved**
   - Last 10 most recent records
   - Filtered by:
     - Recent diagnoses (last 3)
     - Current medications
     - Latest vital signs
     - Recent lab test results
     - Known allergies
     - Medical history

3. **Context Injected into Prompt**
   ```
   Patient Information:
   Name: ABISHEK Kumar
   Address: Rajiv Chowk, Delhi
   
   === MEDICAL RECORDS ===
   
   Recent Diagnoses:
   1. Hypertension (managed)
   2. Type 2 Diabetes
   
   Current Medications:
   1. Lisinopril 10mg daily
   2. Metformin 500mg twice daily
   
   Latest Vitals:
   - Blood Pressure: 140/90 mmHg
   - Heart Rate: 78 bpm
   - Weight: 82 kg
   - BMI: 28.5
   
   [Additional medical data...]
   ```

4. **Gemini Processes Context**
   - Understands patient's unique health profile
   - Generates personalized response
   - Considers medications and contraindications

5. **Response Delivered**
   - AI response appears in chat
   - Conversation history stored (last 20 exchanges)

## API Usage Examples

### Send Message to Chatbot

```bash
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"I have been feeling dizzy lately. Is this related to my medications?"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Based on your medical profile, dizziness can be a side effect of blood pressure medications like Lisinopril...",
  "metadata": {
    "patientName": "ABISHEK Kumar",
    "timestamp": "2024-02-26T10:30:00Z",
    "messageLength": 245
  }
}
```

### Get Conversation History

```bash
curl -X GET http://localhost:5000/api/chatbot/history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Health Summary

```bash
curl -X GET http://localhost:5000/api/chatbot/health-summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "patientName": "ABISHEK Kumar",
    "recentDiagnoses": [
      {"diagnosis": "Hypertension", "date": "2024-02-20"},
      {"diagnosis": "Type 2 Diabetes", "date": "2024-02-15"}
    ],
    "currentMedications": ["Lisinopril", "Metformin"],
    "latestVitals": {
      "heartRate": 78,
      "bloodPressure": "140/90",
      "weight": 82,
      "bmi": 28.5
    },
    "allergies": ["Penicillin", "Aspirin"],
    "medicalHistory": []
  }
}
```

### Clear Conversation History

```bash
curl -X DELETE http://localhost:5000/api/chatbot/history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Example Patient Conversations

### Patient 1: ABISHEK Kumar (Hypertension, Diabetes)

**Patient:** "I've been feeling more tired than usual"

**AI Response:** "Fatigue can be common with Type 2 Diabetes and your current blood pressure management. Given your Metformin dose of 500mg twice daily and Lisinopril 10mg, this could be related to your medication adjustment. Consider checking your current blood sugar levels (your last reading was 145 mg/dL). However, please consult with your doctor if fatigue persists or worsens. In the meantime, ensure adequate hydration and rest."

---

### Patient 2: DEVARANJAN Reddy

**Patient:** "Can I take ibuprofen for my headache?"

**AI Response:** "Based on your medical records, you don't have documented allergies to ibuprofen. However, since you're taking certain medications, I'd recommend consulting your doctor before taking any new medication. Also, if your headaches are frequent, this would be worth discussing with your healthcare provider during your next visit."

---

### Patient 3: HARINI Patel

**Patient:** "What should I eat for my condition?"

**AI Response:** "Based on your recent diagnoses and current health status, I recommend focusing on a balanced diet. Given your vitals, consider limiting sodium intake and increasing fiber-rich foods. However, for personalized dietary recommendations, please consult with a nutritionist or your attending physician..."

## Personalization Examples

### Different Responses for Same Question

**Same Question:** "What foods should I avoid?"

**For ABISHEK (Diabetes + Hypertension):**
"You should avoid foods high in sodium and refined sugars. This includes processed meats, sugary beverages, and high-sodium snacks..."

**For HARINI (Different conditions):**
"Your diet restrictions are specific to your conditions. Based on your records, I recommend..."

**For BIRUDHA (Different medical profile):**
"Considering your current medications and health status..."

## Token Management

- Conversation history stores last 40 messages (20 exchanges)
- Older messages are automatically removed to manage token usage
- Each conversation is isolated per patient
- History is cleared when browser session ends or manually cleared

## Security Considerations

✅ **Implemented:**
- JWT authentication on all endpoints
- Role-based access control (patients only)
- Per-patient data isolation
- No sensitive data in logs
- HTTPS recommended for production

⚠️ **Disclaimers in UI:**
- "Always consult your doctor for serious health concerns"
- "This AI assistant provides information based on your medical records"
- Messages remind users of AI limitations

## Troubleshooting

### "Gemini API key not configured"
**Solution:** Add `GEMINI_API_KEY` to `.env` file in server directory

### "Failed to fetch health summary"
**Solution:** Ensure backend is running and MongoDB is connected with patient medical records

### Slow responses
**Solution:** 
- Check internet connection
- Verify Gemini API quota
- Consider reducing medical records context

### Messages not persisting
**Solution:** 
- History is stored in memory (not database)
- Clear browser cache
- Check browser console for errors

## Future Enhancements

- [ ] Database persistence of conversation history
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Integration with wearable device data
- [ ] Doctor review of chatbot conversations
- [ ] Learning from doctor corrections
- [ ] Scheduled health reminders
- [ ] Export conversation as PDF
- [ ] Integration with appointment scheduling

## API Rate Limits

- Gemini API: Check your Google AI Studio quota
- Per-patient safety: Implement request rate limiting if needed
- Suggested: 100 messages per patient per day

## Testing the Chatbot

Use demo patient accounts:
- **Email:** abishek@healx.com
- **Password:** patient1@123

Or login with:
- **Email:** devaranjan@healx.com
- **Email:** harini@healx.com
- **Email:** birudha@healx.com

All have password: `patient1@123`

## License

Part of HEALX Health Platform
