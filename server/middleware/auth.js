const jwt = require('jwt-simple');
const User = require('../models/User');

// Demo mode users (bypass MongoDB lookup) - must match mock-db.js IDs
const demoUsers = {
  'admin1': { _id: 'admin1', email: 'admin@healx.com', role: 'admin', firstName: 'Admin', lastName: 'User' },
  'doctor1': { _id: 'doctor1', email: 'doctor1@healx.com', role: 'doctor', firstName: 'Dr. Rajesh', lastName: 'Kumar' },
  'doctor2': { _id: 'doctor2', email: 'doctor2@healx.com', role: 'doctor', firstName: 'Dr. Priya', lastName: 'Sharma' },
  'user11': { _id: 'user11', email: 'patient1@healx.com', role: 'patient', firstName: 'Patient', lastName: 'One' },
  'user1': { _id: 'user1', email: 'amit.patel@email.com', role: 'patient', firstName: 'Amit', lastName: 'Patel' }
};


const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No authentication token, authorization denied' });
    }

    const decoded = jwt.decode(token, process.env.JWT_SECRET || 'demo-secret');
    
    // Check if it's a demo token (isDemo flag)
    if (decoded.isDemo) {
      // Check if it's a known demo user ID
      const demoUser = demoUsers[decoded.userId];
      if (demoUser) {
        req.user = demoUser;
        req.userId = demoUser._id;
        req.isDemoUser = true;
        return next();
      }
      // For any other demo user ID (like 'demo-123456'), create a generic demo user
      req.user = {
        _id: decoded.userId,
        email: 'demo@healx.com',
        role: 'patient',
        firstName: 'Demo',
        lastName: 'User'
      };
      req.userId = decoded.userId;
      req.isDemoUser = true;
      return next();
    }

    // Normal MongoDB lookup
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

module.exports = { auth, authorize };
