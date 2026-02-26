const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const ambulanceController = require('../controllers/ambulanceController');

router.get('/', auth, ambulanceController.getAllAmbulances);
router.post('/', auth, authorize('admin', 'ambulance_driver'), ambulanceController.createAmbulance);
router.get('/nearby', ambulanceController.findNearbyAmbulances);
router.get('/:id', auth, ambulanceController.getAmbulance);
router.put('/:id/location', auth, ambulanceController.updateLocation);
router.put('/:id/status', auth, ambulanceController.updateStatus);
router.put('/:id/fuel', auth, ambulanceController.updateFuelLevel);
router.post('/:id/assign-assistant', auth, authorize('admin'), ambulanceController.assignAssistant);
router.get('/:id/tracking', auth, ambulanceController.getAmbulanceTracking);

module.exports = router;
