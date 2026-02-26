const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const campController = require('../controllers/campController');

router.get('/', campController.getAllCamps);
router.post('/', auth, authorize('admin', 'doctor'), campController.createCamp);
router.get('/nearby', campController.findNearbyCamps);
router.get('/:id', campController.getCamp);
router.put('/:id', auth, campController.updateCamp);
router.delete('/:id', auth, authorize('admin', 'doctor'), campController.deleteCamp);
router.post('/:id/register', auth, campController.registerPatient);
router.post('/:id/doctors', auth, authorize('admin', 'doctor'), campController.addDoctor);

module.exports = router;
