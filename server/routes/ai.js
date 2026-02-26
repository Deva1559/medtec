const express = require('express');
const router = express.Router();
const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Proxy disease prediction request to AI service
router.post('/predict-disease', async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/api/predict-disease`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('AI Service error:', error.message);
    res.status(500).json({ 
      error: 'AI service unavailable',
      predicted_disease: 'Service Unavailable',
      confidence: 0,
      recommendation: 'Please try again later'
    });
  }
});

// Proxy severity prediction request to AI service
router.post('/predict-severity', async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/api/predict-severity`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('AI Service error:', error.message);
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

// Proxy health score request to AI service
router.post('/health-score', async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/api/health-score`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('AI Service error:', error.message);
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

// Proxy symptoms list request to AI service
router.get('/symptoms', async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/api/symptoms`);
    res.json(response.data);
  } catch (error) {
    console.error('AI Service error:', error.message);
    // Return default symptoms if AI service is unavailable
    res.json({
      symptoms: [
        'itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'shivering',
        'chills', 'joint_pain', 'stomach_pain', 'acidity', 'ulcers_on_tongue',
        'vomiting', 'burning_micturition', 'spotting_urination', 'fatigue', 'weight_gain',
        'anxiety', 'cold_hands_and_feets', 'mood_swings', 'weight_loss', 'restlessness',
        'lethargy', 'patches_in_throat', 'irregular_sugar_level', 'cough', 'high_fever',
        'sunken_eyes', 'breathlessness', 'sweating', 'dehydration', 'indigestion', 'headache'
      ],
      count: 31,
      diseases: ['Fungal infection', 'Allergy', 'GERD', 'Diabetes', 'Gastroenteritis'],
      diseases_count: 5
    });
  }
});

// Proxy chat request to AI service
router.post('/chat', async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/api/chat`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('AI Service error:', error.message);
    res.status(500).json({ 
      error: 'AI service unavailable',
      response: 'I apologize, but the AI service is currently unavailable. Please try again later.',
      confidence: 0
    });
  }
});

module.exports = router;
