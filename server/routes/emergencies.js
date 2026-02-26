const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const emergencyController = require('../controllers/emergencyController');

router.post('/', auth, emergencyController.createEmergency);
router.get('/', auth, emergencyController.getEmergencies);
router.get('/nearby', emergencyController.findNearbyEmergencies);
router.get('/user/my-emergencies', auth, emergencyController.getEmergenciesByUser);
router.get('/:id', auth, emergencyController.getEmergency);
router.put('/:id/status', auth, emergencyController.updateEmergencyStatus);
router.post('/:id/assign-doctor', auth, authorize('admin', 'doctor'), emergencyController.assignDoctor);

module.exports = router;
