const jwt = require('jwt-simple');
const User = require('../models/User');
const mockDb = require('../mock-db');

// Predefined credentials - ONLY these email/password combinations are allowed
const PREDEFINED_CREDENTIALS = {
  'admin@healx.com': {
    password: 'admin@123',

    user: {
      _id: 'admin1',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@healx.com',
      role: 'admin',
      phone: '9876543210',
      avatar: 'https://via.placeholder.com/150'
    }
  },
  'doctor1@healx.com': {
    password: 'doctor1@123',

    user: {
      _id: 'doctor1',
      firstName: 'Dr. Rajesh',
      lastName: 'Kumar',
      email: 'doctor1@healx.com',
      role: 'doctor',
      phone: '9876543211',
      avatar: 'https://via.placeholder.com/150',
      medicalLicense: { number: 'DL12345', specialization: 'General Medicine' }
    }
  },
  'patient1@healx.com': {
    password: 'patient1@123',

    user: {
      _id: 'user1',
      firstName: 'Amit',
      lastName: 'Patel',
      email: 'patient1@healx.com',
      role: 'patient',
      phone: '9876510001',
      avatar: 'https://via.placeholder.com/150'
    }
  }
};

exports.register = async (req, res) => {

  try {
    const { firstName, lastName, email, password, phone, role } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: role || 'patient',
      // Add default location (Delhi, India coordinates)
      location: {
        type: 'Point',
        coordinates: [77.2090, 28.6139]  // [longitude, latitude]
      }
    });

    await user.save();

    const token = jwt.encode({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: 'https://via.placeholder.com/150'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // First try to find user in MongoDB
    let user = null;
    try {
      user = await User.findOne({ email });
    } catch (mongoErr) {
      console.log('MongoDB lookup failed, using mock database');
    }
    
    // If not found in MongoDB, check mock database
    if (!user) {
      user = mockDb.users.find(u => u.email === email);
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare password using bcrypt (for MongoDB users) or direct comparison (for mock users)
    let isPasswordValid = false;
    if (user.comparePassword) {
      isPasswordValid = await user.comparePassword(password);
    } else {
      // For mock users, check against predefined credentials
      const predefined = PREDEFINED_CREDENTIALS[email];
      isPasswordValid = predefined && predefined.password === password;
    }
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token for authenticated user
    const token = jwt.encode({ 
      userId: user._id, 
      isDemo: false 
    }, process.env.JWT_SECRET || 'demo-secret');
    
    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.demoLogin = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Try to find real user in MongoDB
    let user = null;
    try {
      user = await User.findOne({ email }).select('-password');
    } catch (mongoErr) {
      console.log('MongoDB lookup failed:', mongoErr.message);
    }
    
    // If not found in MongoDB, check mock database
    if (!user) {
      user = mockDb.users.find(u => u.email === email);
    }
    
    // If still not found, return error
    if (!user) {
      return res.status(404).json({ error: 'Demo user not found' });
    }
    
    const token = jwt.encode({ 
      userId: user._id, // Use actual user ID from database
      isDemo: true  // Keep isDemo as true for auth middleware to handle
    }, process.env.JWT_SECRET);
    
    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    // Try MongoDB first
    let user = null;
    try {
      user = await User.findById(req.userId).select('-password');
    } catch (mongoErr) {
      // MongoDB not available
    }
    
    // If not found, check mock database
    if (!user) {
      user = mockDb.users.find(u => u._id === req.userId);
    }
    
    // If still not found but is demo user
    if (!user && req.isDemoUser) {
      user = {
        _id: req.userId,
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@healx.com',
        role: 'patient'
      };
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address, avatar } = req.body;
    
    // Try MongoDB first
    let user = null;
    try {
      user = await User.findByIdAndUpdate(
        req.userId,
        { firstName, lastName, phone, address, avatar, updatedAt: Date.now() },
        { new: true }
      ).select('-password');
    } catch (mongoErr) {
      // MongoDB not available
    }
    
    // If not found, return mock update
    if (!user && req.isDemoUser) {
      user = {
        _id: req.userId,
        firstName: firstName || 'Demo',
        lastName: lastName || 'User',
        phone,
        address,
        avatar
      };
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};
