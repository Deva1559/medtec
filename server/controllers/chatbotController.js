const { GoogleGenerativeAI } = require('@google/generative-ai');
const MedicalRecord = require('../models/MedicalRecord');
const User = require('../models/User');

// Store conversation history per patient
const conversationHistories = new Map();

// Lazy initialization of Gemini client
let genAI = null;
const getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      throw new Error('GEMINI_API_KEY is not configured in .env file');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

// Build personalized context from patient medical data
const buildPatientContext = async (patientId, user) => {
  try {
    // Check if MongoDB is connected
    if (!global.mongoConnected) {
      // Return basic context from user object for demo mode
      let context = `Patient Information:\n`;
      context += `Name: ${user.firstName} ${user.lastName}\n`;
      context += `Email: ${user.email || 'N/A'}\n`;
      context += `\n=== DEMO MODE ===\n`;
      context += `Running in demonstration mode without database connection.\n`;
      context += `The chatbot will provide general health information.\n`;
      context += `\n=== CHATBOT INSTRUCTIONS ===\n`;
      context += `You are a helpful healthcare assistant AI. Provide general health information and wellness tips.\n`;
      context += `Always remind users to consult their doctor for serious health concerns.\n`;
      context += `Be empathetic and supportive in your responses.\n`;
      return context;
    }

    const patient = await User.findById(patientId);
    const medicalRecords = await MedicalRecord.find({ patient: patientId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('doctor', 'firstName lastName medicalLicense');

    if (!patient) {
      return '';
    }

    let context = `Patient Information:\n`;
    context += `Name: ${patient.firstName} ${patient.lastName}\n`;
    context += `Email: ${patient.email}\n`;
    context += `Phone: ${patient.phone}\n`;

    if (patient.address) {
      context += `Address: ${patient.address.street}, ${patient.address.city}, ${patient.address.state}, ${patient.address.country}\n`;
    }

    context += `\n=== MEDICAL RECORDS ===\n`;

    // Add latest diagnoses
    const diagnoses = medicalRecords.filter(r => r.recordType === 'diagnosis');
    if (diagnoses.length > 0) {
      context += `\nRecent Diagnoses:\n`;
      diagnoses.slice(0, 3).forEach((record, index) => {
        context += `${index + 1}. ${record.diagnosis} (${new Date(record.createdAt).toLocaleDateString()})\n`;
        if (record.symptoms && record.symptoms.length > 0) {
          context += `   Symptoms: ${record.symptoms.join(', ')}\n`;
        }
        if (record.treatmentPlan) {
          context += `   Treatment Plan: ${record.treatmentPlan}\n`;
        }
      });
    }

    // Add latest vitals
    const latestVitals = medicalRecords.find(r => r.vitals && Object.keys(r.vitals).length > 0);
    if (latestVitals && latestVitals.vitals) {
      context += `\nLatest Vitals (${new Date(latestVitals.createdAt).toLocaleDateString()}):\n`;
      const { heartRate, bloodPressure, temperature, respirationRate, weight, height, bmi, oxygenLevel } = latestVitals.vitals;
      if (heartRate) context += `- Heart Rate: ${heartRate} bpm\n`;
      if (bloodPressure) context += `- Blood Pressure: ${bloodPressure} mmHg\n`;
      if (temperature) context += `- Temperature: ${temperature}°C\n`;
      if (respirationRate) context += `- Respiration Rate: ${respirationRate} breaths/min\n`;
      if (weight) context += `- Weight: ${weight} kg\n`;
      if (height) context += `- Height: ${height} cm\n`;
      if (bmi) context += `- BMI: ${bmi}\n`;
      if (oxygenLevel) context += `- Oxygen Level: ${oxygenLevel}%\n`;
    }

    // Add medications
    const prescriptions = medicalRecords.filter(r => r.recordType === 'prescription' && r.prescription);
    if (prescriptions.length > 0) {
      context += `\nCurrent Medications:\n`;
      prescriptions.slice(0, 3).forEach((record, index) => {
        record.prescription.forEach((med, mIndex) => {
          context += `${index + mIndex + 1}. ${med.medicine}\n`;
          context += `   - Dosage: ${med.dosage}\n`;
          context += `   - Frequency: ${med.frequency}\n`;
          context += `   - Duration: ${med.duration}\n`;
          if (med.notes) context += `   - Notes: ${med.notes}\n`;
        });
      });
    }

    // Add lab tests
    const labReports = medicalRecords.filter(r => r.recordType === 'lab_report' && r.labTests);
    if (labReports.length > 0) {
      context += `\nRecent Lab Test Results:\n`;
      labReports.slice(0, 2).forEach((record, index) => {
        context += `Lab Report ${index + 1} (${new Date(record.createdAt).toLocaleDateString()}):\n`;
        record.labTests.forEach((test, tIndex) => {
          context += `${tIndex + 1}. ${test.testName}: ${test.result} ${test.unit} (Range: ${test.referenceRange})`;
          if (test.abnormal) context += ` [ABNORMAL]`;
          context += `\n`;
        });
      });
    }

    // Add allergies
    if (patient.allergies && patient.allergies.length > 0) {
      context += `\nAllergies: ${patient.allergies.join(', ')}\n`;
    }

    // Add allergies from medical records
    const allergies = new Set();
    medicalRecords.forEach(r => {
      if (r.allergies && r.allergies.length > 0) {
        r.allergies.forEach(a => allergies.add(a));
      }
    });
    if (allergies.size > 0) {
      context += `\nKnown Allergies: ${Array.from(allergies).join(', ')}\n`;
    }

    // Add medical history
    const medicalHistory = new Set();
    medicalRecords.forEach(r => {
      if (r.medicalHistory && r.medicalHistory.length > 0) {
        r.medicalHistory.forEach(h => medicalHistory.add(h));
      }
    });
    if (medicalHistory.size > 0) {
      context += `\nMedical History: ${Array.from(medicalHistory).join(', ')}\n`;
    }

    context += `\n=== CHATBOT INSTRUCTIONS ===\n`;
    context += `You are a helpful healthcare assistant AI. Based on the patient's medical data above:\n`;
    context += `1. Provide personalized health advice considering their specific medical conditions and medications\n`;
    context += `2. Answer questions about their diagnoses, treatments, and medications\n`;
    context += `3. Suggest general wellness tips appropriate for their health status\n`;
    context += `4. Always remind them to consult their doctor for serious health concerns\n`;
    context += `5. Do not provide medical diagnoses - only use their existing records for context\n`;
    context += `6. Be empathetic and supportive in your responses\n`;

    return context;
  } catch (error) {
    console.error('Error building patient context:', error);
    return '';
  }
};

// Initialize or get conversation history
const getOrCreateHistory = (patientId) => {
  if (!conversationHistories.has(patientId)) {
    conversationHistories.set(patientId, []);
  }
  return conversationHistories.get(patientId);
};

// Send message to Gemini
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const patientId = req.user.id;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Check if API key is configured and not the placeholder
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
      console.error('❌ GEMINI_API_KEY is not configured or is a placeholder');
      return res.status(500).json({ 
        error: 'Chatbot API is not configured',
        details: 'Please configure GEMINI_API_KEY in server/.env file. Get it from https://aistudio.google.com/app/apikey'
      });
    }

    // Get conversation history
    const history = getOrCreateHistory(patientId);

    // Build patient context
    const patientContext = await buildPatientContext(patientId, req.user);

    // Format messages for Gemini API with system context
    const formattedHistory = [
      {
        role: 'user',
        parts: [{ text: patientContext }]
      },
      {
        role: 'model',
        parts: [{ text: 'I have reviewed your medical profile and I\'m ready to assist you with health-related questions. How can I help you today?' }]
      },
      ...history,
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    // Try to get/initialize Gemini client
    try {
      // Call Gemini API with lazy-loaded client
      const aiClient = getGenAI();
      // Updated to use gemini-1.5-flash model (latest stable model)
      const model = aiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const chat = model.startChat({ history: formattedHistory.slice(0, -1) });
      
      const result = await chat.sendMessage(message);
      const aiResponse = result.response.text();

      // Store messages in history (keep last 20 messages to manage token limits)
      history.push(
        { role: 'user', parts: [{ text: message }] },
        { role: 'model', parts: [{ text: aiResponse }] }
      );

      if (history.length > 40) {
        history.splice(0, 2);
      }

      res.json({
        success: true,
        message: aiResponse,
        metadata: {
          patientName: req.user.firstName + ' ' + req.user.lastName,
          timestamp: new Date(),
          messageLength: aiResponse.length
        }
      });
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      res.status(500).json({ 
        error: 'Failed to get AI response',
        details: geminiError.message 
      });
    }
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      details: error.message 
    });
  }
};

// Get conversation history
exports.getHistory = async (req, res) => {
  try {
    const patientId = req.user.id;
    const history = getOrCreateHistory(patientId);

    res.json({
      success: true,
      history: history,
      count: history.length / 2 // Each exchange is 2 items (user + model)
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch conversation history' });
  }
};

// Clear conversation history
exports.clearHistory = async (req, res) => {
  try {
    const patientId = req.user.id;
    conversationHistories.delete(patientId);

    res.json({
      success: true,
      message: 'Conversation history cleared'
    });
  } catch (error) {
    console.error('Error clearing history:', error);
    res.status(500).json({ error: 'Failed to clear conversation history' });
  }
};

// Get patient health summary for chatbot context
exports.getHealthSummary = async (req, res) => {
  try {
    const patientId = req.user.id || req.user._id;
    
    // Check if MongoDB is connected
    if (!global.mongoConnected) {
      // Return demo health summary
      const summary = {
        patientName: `${req.user.firstName} ${req.user.lastName}`,
        recentDiagnoses: [],
        currentMedications: [],
        latestVitals: {},
        allergies: [],
        medicalHistory: []
      };

      return res.json({
        success: true,
        summary,
        demo: true
      });
    }

    const patient = await User.findById(patientId);
    const medicalRecords = await MedicalRecord.find({ patient: patientId })
      .sort({ createdAt: -1 })
      .limit(10);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const summary = {
      patientName: `${patient.firstName} ${patient.lastName}`,
      recentDiagnoses: medicalRecords
        .filter(r => r.recordType === 'diagnosis')
        .map(r => ({ diagnosis: r.diagnosis, date: r.createdAt }))
        .slice(0, 3),
      currentMedications: medicalRecords
        .filter(r => r.recordType === 'prescription')
        .flatMap(r => r.prescription ? r.prescription.map(m => m.medicine) : [])
        .slice(0, 5),
      latestVitals: medicalRecords
        .find(r => r.vitals && Object.keys(r.vitals).length > 0)
        ?.vitals || {},
      allergies: Array.from(new Set(
        medicalRecords
          .filter(r => r.allergies)
          .flatMap(r => r.allergies)
      )),
      medicalHistory: patient.medicalHistory || []
    };

    res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('Error fetching health summary:', error);
    res.status(500).json({ error: 'Failed to fetch health summary' });
  }
};
