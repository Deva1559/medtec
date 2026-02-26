const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const { auth } = require('../middleware/auth');
const authController = require('../controllers/authController');

// Demo login (works with database) - Uses authController
router.post('/demo-login', authController.demoLogin);


// Regular auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);
router.post('/logout', auth, authController.logout);

module.exports = router;
