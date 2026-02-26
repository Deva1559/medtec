const Ambulance = require('../models/Ambulance');

// Helper function to check if MongoDB is connected
const isMongoConnected = () => {
  if (global.mongoConnected === true) return true;
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
};

// Mock ambulances data for demo mode
const mockAmbulances = [
  {
    _id: 'amb1',
    ambulanceId: 'AMB001',
    registrationNumber: 'DL-01-AB-1234',
    model: 'Toyota Hiace',
    year: 2022,
    status: 'available',
    fuelLevel: 85,
    baseStation: 'Delhi Central',
    location: {
      type: 'Point',
      coordinates: [77.1025, 28.7041]
    },
    driver: { _id: 'driver1', firstName: 'Rajesh', lastName: 'Kumar', phone: '9876543210' },
    assistant: { _id: 'asst1', firstName: 'Amit', lastName: 'Singh', phone: '9876543211' }
  },
  {
    _id: 'amb2',
    ambulanceId: 'AMB002',
    registrationNumber: 'DL-01-CD-5678',
    model: 'Force Traveller',
    year: 2021,
    status: 'on_duty',
    fuelLevel: 60,
    baseStation: 'Delhi North',
    location: {
      type: 'Point',
      coordinates: [77.2100, 28.6500]
    },
    driver: { _id: 'driver2', firstName: 'Suresh', lastName: 'Verma', phone: '9876543220' },
    assistant: null
  },
  {
    _id: 'amb3',
    ambulanceId: 'AMB003',
    registrationNumber: 'MH-02-EF-9012',
    model: 'Tata Winger',
    year: 2023,
    status: 'available',
    fuelLevel: 95,
    baseStation: 'Mumbai Central',
    location: {
      type: 'Point',
      coordinates: [72.8777, 19.0760]
    },
    driver: { _id: 'driver3', firstName: 'Mahesh', lastName: 'Patel', phone: '9876543230' },
    assistant: { _id: 'asst2', firstName: 'Ravi', lastName: 'Sharma', phone: '9876543231' }
  }
];

const generateAmbulanceId = () => {
  return 'AMB' + Date.now() + Math.random().toString(36).substr(2, 9);
};

exports.getAllAmbulances = async (req, res) => {
  try {
    // Return mock data if MongoDB is not connected OR for demo users
    if (!isMongoConnected() || req.isDemoUser) {
      console.log('🚑 Returning mock ambulances (MongoDB not connected)');
      return res.json(mockAmbulances);
    }

    const { status, cityCode } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const ambulances = await Ambulance.find(filter)
      .populate('driver', 'firstName lastName phone')
      .populate('assistant', 'firstName lastName phone');

    res.json(ambulances);
  } catch (error) {
    console.log('Ambulances error, returning mock data:', error.message);
    res.json(mockAmbulances);
  }
};

exports.createAmbulance = async (req, res) => {
  try {
    const { registrationNumber, baseStation, model, year, features, capacity } = req.body;

    const ambulance = new Ambulance({
      ambulanceId: generateAmbulanceId(),
      registrationNumber,
      driver: req.userId,
      baseStation,
      model,
      year,
      features,
      capacity,
      fuelLevel: 100,
      location: {
        type: 'Point',
        coordinates: [0, 0]
      }
    });

    await ambulance.save();
    await ambulance.populate('driver', 'firstName lastName phone');
    res.status(201).json(ambulance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAmbulance = async (req, res) => {
  try {
    // Return mock data if MongoDB is not connected OR for demo users
    if (!isMongoConnected() || req.isDemoUser) {
      const mockAmbulance = mockAmbulances.find(a => a._id === req.params.id);
      if (mockAmbulance) {
        return res.json(mockAmbulance);
      }
      return res.status(404).json({ error: 'Ambulance not found' });
    }

    const ambulance = await Ambulance.findById(req.params.id)
      .populate('driver', 'firstName lastName phone')
      .populate('assistant', 'firstName lastName phone')
      .populate('assignedEmergency');

    if (!ambulance) {
      return res.status(404).json({ error: 'Ambulance not found' });
    }
    res.json(ambulance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { longitude, latitude } = req.body;
    const io = req.app.get('io');

    const ambulance = await Ambulance.findById(req.params.id);
    if (!ambulance) {
      return res.status(404).json({ error: 'Ambulance not found' });
    }

    ambulance.location = {
      type: 'Point',
      coordinates: [longitude, latitude]
    };

    ambulance.locationHistory.push({
      coordinates: [longitude, latitude],
      timestamp: Date.now()
    });

    await ambulance.save();
    io.emit('ambulance:move', {
      ambulanceId: ambulance._id,
      location: ambulance.location,
      timestamp: Date.now()
    });

    res.json(ambulance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const io = req.app.get('io');

    const ambulance = await Ambulance.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!ambulance) {
      return res.status(404).json({ error: 'Ambulance not found' });
    }

    io.emit('ambulance:status_changed', {
      ambulanceId: ambulance._id,
      status: ambulance.status
    });

    res.json(ambulance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateFuelLevel = async (req, res) => {
  try {
    const { fuelLevel } = req.body;
    const ambulance = await Ambulance.findByIdAndUpdate(
      req.params.id,
      { fuelLevel, updatedAt: Date.now() },
      { new: true }
    );

    if (!ambulance) {
      return res.status(404).json({ error: 'Ambulance not found' });
    }

    res.json(ambulance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignAssistant = async (req, res) => {
  try {
    const { assistantId } = req.body;
    const ambulance = await Ambulance.findByIdAndUpdate(
      req.params.id,
      { assistant: assistantId },
      { new: true }
    ).populate('driver', 'firstName lastName phone')
     .populate('assistant', 'firstName lastName phone');

    if (!ambulance) {
      return res.status(404).json({ error: 'Ambulance not found' });
    }

    res.json(ambulance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findNearbyAmbulances = async (req, res) => {
  try {
    // Return mock data if MongoDB is not connected OR for demo users
    if (!isMongoConnected() || req.isDemoUser) {
      console.log('🚑 Returning mock nearby ambulances (MongoDB not connected)');
      return res.json(mockAmbulances.filter(a => a.status === 'available'));
    }

    const { longitude, latitude, maxDistance = 5000 } = req.query;
    const ambulances = await Ambulance.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: maxDistance
        }
      },
      status: 'available'
    }).populate('driver', 'firstName lastName phone');

    res.json(ambulances);
  } catch (error) {
    console.log('Nearby ambulances error, returning mock data:', error.message);
    res.json(mockAmbulances.filter(a => a.status === 'available'));
  }
};

exports.getAmbulanceTracking = async (req, res) => {
  try {
    // Return mock data if MongoDB is not connected OR for demo users
    if (!isMongoConnected() || req.isDemoUser) {
      const mockAmbulance = mockAmbulances.find(a => a._id === req.params.id);
      if (mockAmbulance) {
        return res.json({
          ambulanceId: mockAmbulance.ambulanceId,
          currentLocation: mockAmbulance.location,
          locationHistory: [],
          status: mockAmbulance.status
        });
      }
      return res.status(404).json({ error: 'Ambulance not found' });
    }

    const ambulance = await Ambulance.findById(req.params.id);
    if (!ambulance) {
      return res.status(404).json({ error: 'Ambulance not found' });
    }

    // Return recent location history (last 100 points)
    const recentHistory = ambulance.locationHistory.slice(-100);
    res.json({
      ambulanceId: ambulance.ambulanceId,
      currentLocation: ambulance.location,
      locationHistory: recentHistory,
      status: ambulance.status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
