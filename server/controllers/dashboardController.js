const Emergency = require('../models/Emergency');
const HealthCamp = require('../models/HealthCamp');
const Ambulance = require('../models/Ambulance');
const User = require('../models/User');
const MedicalRecord = require('../models/MedicalRecord');

// Mock data - always available when MongoDB is not connected
const mockStats = {
  totalEmergencies: 45,
  criticalEmergencies: 8,
  totalAmbulances: 12,
  availableAmbulances: 7,
  totalUsers: 156,
  doctors: 23,
  volunteers: 45,
  totalCamps: 18,
  activeCamps: 3,
  emergenciesBySeverity: [
    { _id: 'critical', count: 8 },
    { _id: 'high', count: 15 },
    { _id: 'medium', count: 12 },
    { _id: 'low', count: 10 }
  ],
  emergenciesByType: [
    { _id: 'cardiac', count: 12 },
    { _id: 'accident', count: 18 },
    { _id: 'breathing', count: 8 },
    { _id: 'other', count: 7 }
  ],
  averageResponseTime: 1250000,
  _demoMode: true
};

const mockTrends = [
  { _id: '2024-01-01', count: 5, critical: 1 },
  { _id: '2024-01-02', count: 8, critical: 2 },
  { _id: '2024-01-03', count: 3, critical: 0 },
  { _id: '2024-01-04', count: 12, critical: 3 },
  { _id: '2024-01-05', count: 7, critical: 1 },
  { _id: '2024-01-06', count: 10, critical: 1 },
  { _id: '2024-01-07', count: 6, critical: 0 }
];

const mockHeatmap = [
  { lat: 28.7041, lng: 77.1025, weight: 5, type: 'cardiac' },
  { lat: 28.7350, lng: 77.1100, weight: 3, type: 'accident' },
  { lat: 28.6500, lng: 77.2000, weight: 1, type: 'breathing' }
];

// Helper function to check if MongoDB is connected - use both methods
const isMongoConnected = () => {
  // Check global variable first (set by server.js)
  if (global.mongoConnected === true) return true;
  
  // Also check mongoose connection state directly
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
};

exports.getStats = async (req, res) => {
  // Return mock data if MongoDB is not connected OR for demo users
  if (!isMongoConnected() || req.isDemoUser) {
    console.log('📊 Returning mock stats (MongoDB not connected)');
    return res.json(mockStats);
  }

  try {
    const { timeRange = '30days' } = req.query;
    let dateFilter = {};

    if (timeRange === '7days') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
    } else if (timeRange === '30days') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
    } else if (timeRange === 'all') {
      dateFilter = {};
    }

    const totalEmergencies = await Emergency.countDocuments(dateFilter);
    const criticalEmergencies = await Emergency.countDocuments({ ...dateFilter, severity: 'critical' });
    const totalAmbulances = await Ambulance.countDocuments();
    const availableAmbulances = await Ambulance.countDocuments({ status: 'available' });
    const totalUsers = await User.countDocuments();
    const doctors = await User.countDocuments({ role: 'doctor' });
    const volunteers = await User.countDocuments({ role: 'volunteer' });
    const totalCamps = await HealthCamp.countDocuments();
    const activeCamps = await HealthCamp.countDocuments({ status: 'ongoing' });

    const emergenciesBySeverity = await Emergency.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    const emergenciesByType = await Emergency.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$emergencyType', count: { $sum: 1 } } }
    ]);

    const averageResponseTime = await Emergency.aggregate([
      {
        $match: {
          ...dateFilter,
          arrivedAt: { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          avgTime: {
            $avg: {
              $subtract: ['$arrivedAt', '$createdAt']
            }
          }
        }
      }
    ]);

    res.json({
      totalEmergencies,
      criticalEmergencies,
      totalAmbulances,
      availableAmbulances,
      totalUsers,
      doctors,
      volunteers,
      totalCamps,
      activeCamps,
      emergenciesBySeverity,
      emergenciesByType,
      averageResponseTime: averageResponseTime[0]?.avgTime || 0
    });
  } catch (error) {
    console.log('Dashboard stats error, returning mock data:', error.message);
    res.json(mockStats);
  }
};

exports.getHeatmap = async (req, res) => {
  // Return mock data if MongoDB is not connected OR for demo users
  if (!isMongoConnected() || req.isDemoUser) {
    console.log('🗺️ Returning mock heatmap (MongoDB not connected)');
    return res.json(mockHeatmap);
  }

  try {
    const emergencies = await Emergency.find({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }).select('location emergencyType severity');

    const heatmapData = emergencies.map(e => ({
      lat: e.location.coordinates[1],
      lng: e.location.coordinates[0],
      weight: e.severity === 'critical' ? 5 : e.severity === 'high' ? 3 : 1,
      type: e.emergencyType
    }));

    res.json(heatmapData);
  } catch (error) {
    console.log('Dashboard heatmap error, returning mock data:', error.message);
    res.json(mockHeatmap);
  }
};

exports.getCampAnalytics = async (req, res) => {
  // Return mock data if MongoDB is not connected
  if (!isMongoConnected()) {
    return res.json({
      camp: {
        name: 'Demo Health Camp',
        type: 'general',
        status: 'ongoing',
        dates: { start: '2024-01-01', end: '2024-12-31' }
      },
      statistics: {
        totalPatients: 150,
        totalRecords: 320,
        recordsByType: [
          { _id: 'checkup', count: 180 },
          { _id: 'vaccination', count: 100 },
          { _id: 'treatment', count: 40 }
        ],
        capacity: 200,
        utilizationRate: 75.00
      },
      _demoMode: true
    });
  }

  try {
    const campId = req.params.campId;
    const camp = await HealthCamp.findById(campId);

    if (!camp) {
      return res.status(404).json({ error: 'Camp not found' });
    }

    const patients = await User.countDocuments({ _id: { $in: camp.patients } });
    const records = await MedicalRecord.countDocuments({ camp: campId });
    const recordsByType = await MedicalRecord.aggregate([
      { $match: { camp: campId } },
      { $group: { _id: '$recordType', count: { $sum: 1 } } }
    ]);

    res.json({
      camp: {
        name: camp.name,
        type: camp.type,
        status: camp.status,
        dates: {
          start: camp.startDate,
          end: camp.endDate
        }
      },
      statistics: {
        totalPatients: patients,
        totalRecords: records,
        recordsByType,
        capacity: camp.capacity,
        utilizationRate: (patients / camp.capacity * 100).toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserMetrics = async (req, res) => {
  // Return mock data if MongoDB is not connected OR for demo users
  if (!isMongoConnected() || req.isDemoUser) {
    console.log('👤 Returning mock user metrics (MongoDB not connected)');
    return res.json({
      role: 'admin',
      totalEmergencies: 45,
      totalPatients: 156,
      activeCamps: 3,
      message: 'Demo mode - showing sample metrics'
    });
  }

  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (user.role === 'doctor') {
      const emergencies = await Emergency.countDocuments({ assignedDoctor: userId });
      const records = await MedicalRecord.countDocuments({ doctor: userId });
      const avgSeverity = await Emergency.aggregate([
        { $match: { assignedDoctor: userId } },
        { $group: { _id: null, avgCritical: { $avg: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] } } } }
      ]);

      res.json({
        role: 'doctor',
        emergencies,
        records,
        criticalCasePercentage: (avgSeverity[0]?.avgCritical * 100 || 0).toFixed(2)
      });
    } else if (user.role === 'patient') {
      const emergencies = await Emergency.countDocuments({ caller: userId });
      const records = await MedicalRecord.countDocuments({ patient: userId });
      const camps = await HealthCamp.countDocuments({ patients: userId });

      res.json({
        role: 'patient',
        emergencies,
        medicalRecords: records,
        campsAttended: camps
      });
    } else {
      res.json({ role: user.role, message: 'Metrics not available for this role' });
    }
  } catch (error) {
    console.log('Dashboard user metrics error, returning mock data:', error.message);
    res.json({
      role: 'admin',
      totalEmergencies: 45,
      totalPatients: 156,
      activeCamps: 3
    });
  }
};

exports.getEmergencyTrends = async (req, res) => {
  // Return mock data if MongoDB is not connected OR for demo users
  if (!isMongoConnected() || req.isDemoUser) {
    console.log('📈 Returning mock trends (MongoDB not connected)');
    return res.json(mockTrends);
  }

  try {
    const trends = await Emergency.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          critical: { $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(trends);
  } catch (error) {
    console.log('Dashboard trends error, returning mock data:', error.message);
    res.json(mockTrends);
  }
};
