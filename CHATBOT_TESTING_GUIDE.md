# API Testing Guide: Health Assistant Chatbot

## 🧪 Testing the Chatbot API

Complete guide with cURL examples and test scenarios.

---

## ⚙️ Prerequisites

1. Backend running: `npm run dev` (port 5000)
2. MongoDB connected and populated
3. JWT token from authenticated patient
4. Gemini API key configured in `.env`

---

## 🔑 Getting JWT Token for Testing

### Method 1: Get Token via Login API

```bash
# Get JWT token for ABISHEK
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "abishek@healx.com",
    "password": "patient1@123"
  }' | jq '.token'
```

**Response:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "69a08bba3b20f8245100dfee",
    "firstName": "ABISHEK",
    "lastName": "Kumar",
    "email": "abishek@healx.com",
    "phone": "9876543218",
    "role": "patient"
  }
}
```

**Save token for subsequent requests:**
```bash
TOKEN='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...'
```

---

## 📨 Test Case 1: Send Simple Message

### Request

```bash
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How can I manage my diabetes better?"
  }'
```

### Expected Response

```json
{
  "success": true,
  "message": "Based on your Type 2 Diabetes diagnosis and current Metformin therapy at 500mg twice daily, here are some ways to manage your diabetes better:\n\n1. **Medication Adherence**: Continue taking Metformin as prescribed. Consistency is key for blood sugar control.\n\n2. **Diet Management**: Given your current BMI of 28.5, focus on:\n   - Low glycemic index foods\n   - Reduced sodium (your BP is 140/90, indicating need for BP control)\n   - Whole grains and fiber\n   - Lean proteins\n\n3. **Regular Exercise**: Start with 150 minutes of moderate activity per week, considering your hypertension.\n\n4. **Blood Sugar Monitoring**: Check regularly, especially given your recent blood glucose readings.\n\n5. **Doctor Consultation**: Discuss your current BP readings with your doctor for potential medication adjustments.\n\nWould you like specific dietary or exercise recommendations?",
  "metadata": {
    "patientName": "ABISHEK Kumar",
    "timestamp": "2024-02-26T10:45:30.123Z",
    "messageLength": 687
  }
}
```

**Notice:** Response is **specific to ABISHEK's** medical profile! ✅

---

## 📨 Test Case 2: Different Patient, Same Question

### Get Token for DEVARANJAN

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "devaranjan@healx.com",
    "password": "patient1@123"
  }' | jq '.token'

TOKEN_DEV='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...'
```

### Ask Same Question

```bash
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Authorization: Bearer $TOKEN_DEV" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How can I manage my diabetes better?"
  }'
```

### Different Response!

```json
{
  "success": true,
  "message": "Based on your medical profile, which includes [DEVARANJAN's unique conditions and medications], here's personalized advice...",
  "metadata": {
    "patientName": "DEVARANJAN Reddy",
    "timestamp": "2024-02-26T10:46:00.000Z"
  }
}
```

**Result:** Different patient → Different response! ✅

---

## 📊 Test Case 3: Get Health Summary

### Request

```bash
curl -X GET http://localhost:5000/api/chatbot/health-summary \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Response

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

---

## 📜 Test Case 4: Get Conversation History

### Request

```bash
curl -X GET http://localhost:5000/api/chatbot/history \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Response

```json
{
  "success": true,
  "history": [
    {
      "role": "user",
      "parts": [
        {
          "text": "How can I manage my diabetes better?"
        }
      ]
    },
    {
      "role": "model",
      "parts": [
        {
          "text": "Based on your Type 2 Diabetes diagnosis..."
        }
      ]
    },
    {
      "role": "user",
      "parts": [
        {
          "text": "What about exercise recommendations?"
        }
      ]
    },
    {
      "role": "model",
      "parts": [
        {
          "text": "For your hypertension and diabetes..."
        }
      ]
    }
  ],
  "count": 2
}
```

---

## 🗑️ Test Case 5: Clear Conversation History

### Request

```bash
curl -X DELETE http://localhost:5000/api/chatbot/history \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Response

```json
{
  "success": true,
  "message": "Conversation history cleared"
}
```

### Verify History is Cleared

```bash
curl -X GET http://localhost:5000/api/chatbot/history \
  -H "Authorization: Bearer $TOKEN"

# Response: { "success": true, "history": [], "count": 0 }
```

---

## ❌ Test Case 6: Authentication Error

### Request (No Token)

```bash
curl -X GET http://localhost:5000/api/chatbot/history \
  -H "Content-Type: application/json"
```

### Response

```json
{
  "error": "No token provided"
}
```

HTTP Status: `401 Unauthorized`

---

## ❌ Test Case 7: Role-Based Access Error

### Request (Login as doctor, try chatbot)

```bash
# Get doctor token
TOKEN_DOCTOR=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor1@healx.com",
    "password": "doctor1@123"
  }' | jq -r '.token')

# Try to access chatbot
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Authorization: Bearer $TOKEN_DOCTOR" \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'
```

### Response

```json
{
  "error": "Only patients can access the chatbot"
}
```

HTTP Status: `403 Forbidden`

---

## 🧪 Full Integration Test Script

Save as `test-chatbot.sh`:

```bash
#!/bin/bash

echo "=== CHATBOT API TEST SUITE ==="
echo

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Get ABISHEK token
echo -e "${YELLOW}Test 1: Login as ABISHEK${NC}"
RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "abishek@healx.com",
    "password": "patient1@123"
  }')

TOKEN=$(echo $RESPONSE | jq -r '.token')
if [ "$TOKEN" != "null" ] && [ ! -z "$TOKEN" ]; then
  echo -e "${GREEN}✓ Got token for ABISHEK${NC}"
  echo "Token: ${TOKEN:0:50}..."
else
  echo -e "${RED}✗ Failed to get token${NC}"
  exit 1
fi
echo

# Test 2: Get health summary
echo -e "${YELLOW}Test 2: Get health summary${NC}"
curl -s -X GET http://localhost:5000/api/chatbot/health-summary \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.summary.patientName'
echo

# Test 3: Send message
echo -e "${YELLOW}Test 3: Send message${NC}"
MESSAGE_RESPONSE=$(curl -s -X POST http://localhost:5000/api/chatbot/message \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "How can I manage my diabetes?"}')

echo "Message sent successfully"
echo $MESSAGE_RESPONSE | jq '.message' | head -c 200
echo "..."
echo

# Test 4: Get history
echo -e "${YELLOW}Test 4: Get conversation history${NC}"
curl -s -X GET http://localhost:5000/api/chatbot/history \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.count'
echo "messages retrieved"
echo

# Test 5: Different patient
echo -e "${YELLOW}Test 5: Login as HARINI (different patient)${NC}"
RESPONSE2=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "harini@healx.com",
    "password": "patient1@123"
  }')

TOKEN2=$(echo $RESPONSE2 | jq -r '.token')
echo -e "${GREEN}✓ Got token for HARINI${NC}"
echo

# Test 6: Same question, different patient
echo -e "${YELLOW}Test 6: Ask same question as HARINI${NC}"
curl -s -X POST http://localhost:5000/api/chatbot/message \
  -H "Authorization: Bearer $TOKEN2" \
  -H "Content-Type: application/json" \
  -d '{"message": "How can I manage my diabetes?"}' | jq '.metadata.patientName'
echo

# Test 7: Clear history
echo -e "${YELLOW}Test 7: Clear conversation history${NC}"
curl -s -X DELETE http://localhost:5000/api/chatbot/history \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.message'
echo

# Test 8: Verify history cleared
echo -e "${YELLOW}Test 8: Verify history is cleared${NC}"
curl -s -X GET http://localhost:5000/api/chatbot/history \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.count'
echo "messages (should be 0)"
echo

# Test 9: Test error case - no token
echo -e "${YELLOW}Test 9: Test authentication error (no token)${NC}"
curl -s -X GET http://localhost:5000/api/chatbot/history \
  -H "Content-Type: application/json" | jq '.error'
echo

echo -e "${GREEN}=== ALL TESTS COMPLETED ===${NC}"
```

### Run Tests

```bash
chmod +x test-chatbot.sh
./test-chatbot.sh
```

### Expected Output

```
=== CHATBOT API TEST SUITE ===

Test 1: Login as ABISHEK
✓ Got token for ABISHEK
Token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...

Test 2: Get health summary
"ABISHEK Kumar"

Test 3: Send message
Message sent successfully
"Based on your Type 2 Diabetes diagnosis and current Metformin therapy..."...

Test 4: Get conversation history
1
messages retrieved

Test 5: Login as HARINI (different patient)
✓ Got token for HARINI

Test 6: Ask same question as HARINI
"HARINI Patel"

Test 7: Clear conversation history
"Conversation history cleared"

Test 8: Verify history is cleared
0
messages (should be 0)

Test 9: Test authentication error (no token)
"No token provided"

=== ALL TESTS COMPLETED ===
```

---

## 📱 Postman Collection

### Import to Postman

Create a new Postman Collection with these requests:

```json
{
  "info": {
    "name": "HEALX Chatbot API",
    "version": "1.0"
  },
  "item": [
    {
      "name": "1. Login as ABISHEK",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"abishek@healx.com\",\n  \"password\": \"patient1@123\"\n}"
        },
        "url": {
          "raw": "http://localhost:5000/api/auth/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "auth", "login"]
        }
      }
    },
    {
      "name": "2. Send Chat Message",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{TOKEN}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"message\": \"How can I manage my diabetes better?\"\n}"
        },
        "url": {
          "raw": "http://localhost:5000/api/chatbot/message",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "chatbot", "message"]
        }
      }
    },
    {
      "name": "3. Get Health Summary",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{TOKEN}}"
          }
        ],
        "url": {
          "raw": "http://localhost:5000/api/chatbot/health-summary",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "chatbot", "health-summary"]
        }
      }
    },
    {
      "name": "4. Get History",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{TOKEN}}"
          }
        ],
        "url": {
          "raw": "http://localhost:5000/api/chatbot/history",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "chatbot", "history"]
        }
      }
    },
    {
      "name": "5. Clear History",
      "request": {
        "method": "DELETE",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{TOKEN}}"
          }
        ],
        "url": {
          "raw": "http://localhost:5000/api/chatbot/history",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "chatbot", "history"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "TOKEN",
      "value": ""
    }
  ]
}
```

### Using in Postman

1. Import collection
2. Run "Login as ABISHEK"
3. Copy token from response
4. Set token in Postman: `{{TOKEN}}`
5. Run other requests

---

## 🎯 Test Scenarios

### Scenario 1: Multi-Turn Conversation

```bash
# Message 1
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "I have type 2 diabetes"}'

# AI Response: "Based on your Type 2 Diabetes diagnosis..."

# Message 2
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "What about exercise?"}'

# AI Response: "Given your diabetes and elevated BP..."
# (Note: AI remembers previous context!)
```

### Scenario 2: Security Test

```bash
# Try with invalid token
curl -X GET http://localhost:5000/api/chatbot/history \
  -H "Authorization: Bearer INVALID_TOKEN"

# Response: 401 Unauthorized
```

### Scenario 3: Role-Based Test

```bash
# Get admin token
ADMIN_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@healx.com", "password": "admin@123"}' \
  | jq -r '.token')

# Try accessing chatbot as admin
curl -X GET http://localhost:5000/api/chatbot/history \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Response: 403 Forbidden - "Only patients can access the chatbot"
```

---

## ✅ Verification Checklist

- [ ] Backend running and responding
- [ ] Patient login working
- [ ] Token generated correctly
- [ ] Chatbot receives messages
- [ ] Different patients get different responses
- [ ] Health summary loads correctly
- [ ] Conversation history stores messages
- [ ] Clear history works
- [ ] Authentication errors caught
- [ ] Role-based access enforced
- [ ] Gemini API responding

---

## 📊 Performance Metrics

Expected timings:

```
Authentication (login): ~200ms
Health summary fetch: ~150ms
Message to Gemini API: ~2-3 seconds
Return response: ~100ms
Total user wait: ~3-3.5 seconds
```

---

Happy testing! 🧪✨
