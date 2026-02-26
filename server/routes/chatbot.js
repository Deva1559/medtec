const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const chatbotController = require('../controllers/chatbotController');

// Ensure patient role for chatbot endpoints
const requirePatient = (req, res, next) => {
  if (req.user.role !== 'patient') {
    return res.status(403).json({ error: 'Only patients can access the chatbot' });
  }
  next();
};

// Send message to chatbot
router.post('/message', auth, requirePatient, chatbotController.sendMessage);

// Get conversation history
router.get('/history', auth, requirePatient, chatbotController.getHistory);

// Clear conversation history
router.delete('/history', auth, requirePatient, chatbotController.clearHistory);

// Get health summary
router.get('/health-summary', auth, requirePatient, chatbotController.getHealthSummary);

module.exports = router;
