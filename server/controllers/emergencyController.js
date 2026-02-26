const Emergency = require('../models/Emergency');
const Ambulance = require('../models/Ambulance');
const User = require('../models/User');
const axios = require('axios');

const generateEmergencyId = () => {
  return 'EMG' + Date.now() + Math.random().toString(36).substr(2, 9);
};

// Mock data for emergencies
const mockEmergencies = [
  {
    _id: '1',
    emergencyId: 'EMG001',
    caller: { _id: '1', firstName: 'Admin', lastName: 'User', phone: '9876543210' },
    emergencyType: 'cardiac',
    address: 'Delhi, India',
    description: 'Chest pain and difficulty breathing',
    status: 'pending',
    severity: 'critical',
    createdAt: new Date()
  },
  {
    _id: '2',
    emergencyId: 'EMG002',
    caller: { _id: '3', firstName: 'Amit', lastName: 'Patel', phone: '9876543211' },
    emergencyType: 'accident',
    address: 'Mumbai, India',
    description: 'Road accident victim',
    status: 'accepted',
    severity: 'high',
    createdAt: new Date()
  },
  {
    _id: '3',
    emergencyId: 'EMG003',
    caller: { _id: '2', firstName: 'Dr. Rajesh', lastName: 'Kumar', phone: '9876543212' },
    emergencyType: 'breathing',
    address: 'Bangalore, India',
    description: 'Shortness of breath',
    status: 'completed',
    severity: 'medium',
    createdAt: new Date()
  }
];

exports.createEmergency = async (req, res) => {
  // Use mock data if MongoDB is not connected
  if (!global.mongoConnected) {
    const newEmergency = {
      _id: `mock-${Date.now()}`,
      emergencyId: generateEmergencyId(),
      caller: req.userId,
      ...req.body,
      status: 'pending',
      severity: 'medium',
      createdAt: new Date()
    };
    return res.status(201).json(newEmergency);
  }

  try {
    const { emergencyType, location, address, description, symptoms, vitals } = req.body;
    const io = req.app.get('io');

    const emergency = new Emergency({
      emergencyId: generateEmergencyId(),
      caller: req.userId,
      emergencyType,
      location,
      address,
      description,
      symptoms,
      vitals,
      severity: 'medium'
    });

    // Call AI service for severity prediction
    try {
      const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/api/predict-severity`, {
        symptoms,
        vitals
      });
      emergency.predictedSeverity = aiResponse.data;
      emergency.severity = aiResponse.data.prediction || 'medium';
    } catch (e) {
      console.error('AI service error:', e);
    }

    await emergency.save();

    // Find nearest ambulances
    const nearbyAmbulances = await Ambulance.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: location.coordinates
          },
          $maxDistance: 10000
        }
      },
      status: 'available'
    });

    if (nearbyAmbulances.length > 0) {
      const ambulance = nearbyAmbulances[0];
      emergency.assignedAmbulance = ambulance._id;
      ambulance.status = 'on_duty';
      ambulance.assignedEmergency = emergency._id;
      await ambulance.save();
      await emergency.save();

      io.emit('emergency:created', {
        emergency,
        ambulance: ambulance.ambulanceId
      });
    } else {
      io.emit('emergency:no_ambulance', { emergency });
    }

    res.status(201).json(emergency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmergencies = async (req, res) => {
  // Use mock data if MongoDB is not connected
  if (!global.mongoConnected) {
    return res.json({
      emergencies: mockEmergencies,
      total: mockEmergencies.length,
      pages: 1
    });
  }

  try {
    const { status, severity, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;

    const emergencies = await Emergency.find(filter)
      .populate('caller', 'firstName lastName phone')
      .populate('assignedAmbulance', 'ambulanceId registrationNumber')
      .populate('assignedDoctor', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Emergency.countDocuments(filter);
    res.json({ emergencies, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmergency = async (req, res) => {
  // Use mock data if MongoDB is not connected
  if (!global.mongoConnected) {
    const emergency = mockEmergencies.find(e => e._id === req.params.id);
    if (!emergency) {
      return res.status(404).json({ error: 'Emergency not found' });
    }
    return res.json(emergency);
  }

  try {
    const emergency = await Emergency.findById(req.params.id)
      .populate('caller', 'firstName lastName phone email')
      .populate('assignedAmbulance', 'ambulanceId registrationNumber location')
      .populate('assignedDoctor', 'firstName lastName medicalLicense');

    if (!emergency) {
      return res.status(404).json({ error: 'Emergency not found' });
    }
    res.json(emergency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEmergencyStatus = async (req, res) => {
  // Use mock data if MongoDB is not connected
  if (!global.mongoConnected) {
    const { status, notes } = req.body;
    return res.json({
      _id: req.params.id,
      status,
      timeline: [{ status, timestamp: Date.now(), notes }]
    });
  }

  try {
    const { status, notes } = req.body;
    const io = req.app.get('io');

    const emergency = await Emergency.findById(req.params.id);
    if (!emergency) {
      return res.status(404).json({ error: 'Emergency not found' });
    }

    emergency.status = status;
    emergency.timeline.push({
      status,
      timestamp: Date.now(),
      notes
    });

    if (status === 'arrived') {
      emergency.arrivedAt = Date.now();
    } else if (status === 'completed') {
      emergency.completedAt = Date.now();
      const ambulance = await Ambulance.findById(emergency.assignedAmbulance);
      if (ambulance) {
        ambulance.status = 'available';
        ambulance.assignedEmergency = null;
        await ambulance.save();
      }
    }

    await emergency.save();
    io.emit('emergency:updated', emergency);
    res.json(emergency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignDoctor = async (req, res) => {
  // Use mock data if MongoDB is not connected
  if (!global.mongoConnected) {
    return res.json({
      _id: req.params.id,
      assignedDoctor: req.body.doctorId
    });
  }

  try {
    const { doctorId } = req.body;
    const emergency = await Emergency.findById(req.params.id);

    if (!emergency) {
      return res.status(404).json({ error: 'Emergency not found' });
    }

    emergency.assignedDoctor = doctorId;
    await emergency.save();
    await emergency.populate('assignedDoctor', 'firstName lastName medicalLicense');
    res.json(emergency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmergenciesByUser = async (req, res) => {
  // Use mock data if MongoDB is not connected
  if (!global.mongoConnected) {
    const userEmergencies = mockEmergencies.filter(e => e.caller._id === req.userId);
    return res.json(userEmergencies);
  }

  try {
    const emergencies = await Emergency.find({ caller: req.userId })
      .populate('assignedAmbulance')
      .sort({ createdAt: -1 });

    res.json(emergencies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findNearbyEmergencies = async (req, res) => {
  // Use mock data if MongoDB is not connected
  if (!global.mongoConnected) {
    return res.json(mockEmergencies.filter(e => e.status === 'pending' || e.status === 'accepted'));
  }

  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query;
    const emergencies = await Emergency.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: maxDistance
        }
      },
      status: { $in: ['pending', 'accepted'] }
    });

    res.json(emergencies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
