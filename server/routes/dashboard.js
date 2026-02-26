const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

router.get('/stats', auth, dashboardController.getStats);
router.get('/heatmap', auth, dashboardController.getHeatmap);
router.get('/camp/:campId/analytics', auth, dashboardController.getCampAnalytics);
router.get('/user/metrics', auth, dashboardController.getUserMetrics);
router.get('/trends/emergencies', auth, dashboardController.getEmergencyTrends);

module.exports = router;
