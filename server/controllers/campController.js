const HealthCamp = require('../models/HealthCamp');
const User = require('../models/User');

// Helper function to check if MongoDB is connected
const isMongoConnected = () => {
  if (global.mongoConnected === true) return true;
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
};

// Mock camps data for demo mode
const mockCamps = [
  {
    _id: 'camp1',
    name: 'Free Health Checkup Camp',
    description: 'Comprehensive health screening for all ages',
    type: 'general',
    status: 'ongoing',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-20'),
    address: { city: 'Delhi', state: 'Delhi' },
    services: ['Blood Test', 'BP Check', 'Sugar Test'],
    capacity: 100,
    registeredCount: 45,
    organizer: { _id: 'admin1', firstName: 'Admin', lastName: 'User', email: 'admin@healx.com' },
    doctors: []
  },
  {
    _id: 'camp2',
    name: 'Eye Care Camp',
    description: 'Free eye checkup and glasses distribution',
    type: 'specialized',
    status: 'planned',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-05'),
    address: { city: 'Mumbai', state: 'Maharashtra' },
    services: ['Eye Test', 'Vision Check', 'Glasses'],
    capacity: 50,
    registeredCount: 20,
    organizer: { _id: 'admin1', firstName: 'Admin', lastName: 'User', email: 'admin@healx.com' },
    doctors: []
  }
];

exports.getAllCamps = async (req, res) => {
  try {
    // Return mock data if MongoDB is not connected OR for demo users
    if (!isMongoConnected() || req.isDemoUser) {
      console.log('🏕️ Returning mock camps (MongoDB not connected)');
      return res.json({ camps: mockCamps, total: mockCamps.length, pages: 1 });
    }

    const { status, type, city, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (city) filter['address.city'] = city;

    const camps = await HealthCamp.find(filter)
      .populate('organizer', 'firstName lastName email phone')
      .populate('doctors', 'firstName lastName medicalLicense')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await HealthCamp.countDocuments(filter);
    res.json({ camps, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.log('Camps error, returning mock data:', error.message);
    res.json({ camps: mockCamps, total: mockCamps.length, pages: 1 });
  }
};


exports.createCamp = async (req, res) => {
  try {
    const { name, description, type, startDate, endDate, location, address, services, capacity, budget } = req.body;

    const camp = new HealthCamp({
      name,
      description,
      type,
      startDate,
      endDate,
      location,
      address,
      services,
      capacity,
      budget,
      organizer: req.userId
    });

    await camp.save();
    await camp.populate('organizer', 'firstName lastName email');
    res.status(201).json(camp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCamp = async (req, res) => {
  try {
    const camp = await HealthCamp.findById(req.params.id)
      .populate('organizer', 'firstName lastName email phone')
      .populate('doctors', 'firstName lastName medicalLicense')
      .populate('volunteers', 'firstName lastName')
      .populate('patients', 'firstName lastName email');

    if (!camp) {
      return res.status(404).json({ error: 'Camp not found' });
    }
    res.json(camp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCamp = async (req, res) => {
  try {
    const camp = await HealthCamp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ error: 'Camp not found' });
    }

    if (camp.organizer.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { name, description, type, startDate, endDate, status, services } = req.body;
    camp.name = name || camp.name;
    camp.description = description || camp.description;
    camp.type = type || camp.type;
    camp.startDate = startDate || camp.startDate;
    camp.endDate = endDate || camp.endDate;
    camp.status = status || camp.status;
    camp.services = services || camp.services;
    camp.updatedAt = Date.now();

    await camp.save();
    res.json(camp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCamp = async (req, res) => {
  try {
    const camp = await HealthCamp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ error: 'Camp not found' });
    }

    if (camp.organizer.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await HealthCamp.findByIdAndDelete(req.params.id);
    res.json({ message: 'Camp deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.registerPatient = async (req, res) => {
  try {
    const camp = await HealthCamp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ error: 'Camp not found' });
    }

    if (camp.registeredCount >= camp.capacity) {
      return res.status(400).json({ error: 'Camp is at full capacity' });
    }

    if (!camp.patients.includes(req.userId)) {
      camp.patients.push(req.userId);
      camp.registeredCount += 1;
      await camp.save();
    }

    res.json({ message: 'Registered for camp', camp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const camp = await HealthCamp.findById(req.params.id);

    if (!camp) {
      return res.status(404).json({ error: 'Camp not found' });
    }

    if (!camp.doctors.includes(doctorId)) {
      camp.doctors.push(doctorId);
      await camp.save();
    }

    await camp.populate('doctors', 'firstName lastName medicalLicense');
    res.json(camp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findNearbyCamps = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query;
    const camps = await HealthCamp.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: maxDistance
        }
      },
      status: { $in: ['planned', 'ongoing'] }
    });

    res.json(camps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
