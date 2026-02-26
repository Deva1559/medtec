const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require('socket.io');
const http = require('http');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});


// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Database Connection - Global variable for all modules
global.mongoConnected = false;

// Check if demo mode is enabled
const isDemoMode = process.env.DEMO_MODE === 'true' || process.env.MOCK_DATABASE === 'true';

const connectDB = async () => {
  // Skip MongoDB connection if DEMO_MODE is enabled
  if (isDemoMode) {
    console.log('⚡ DEMO MODE ENABLED - Using mock database (MongoDB connection skipped)');
    global.mongoConnected = false;
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB connected successfully');
    global.mongoConnected = true;
  } catch (err) {
    console.error('⚠ MongoDB connection error:', err.message);
    console.log('⚠ Server running in DEMO MODE (mock data)');
    global.mongoConnected = false;
  }
};

connectDB();

// Socket.io setup
app.set('io', io);
require('./utils/socket')(io);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/camps', require('./routes/camps'));
app.use('/api/emergencies', require('./routes/emergencies'));
app.use('/api/ambulances', require('./routes/ambulances'));
app.use('/api/records', require('./routes/records'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/ai', require('./routes/ai'));

app.use('/api/chatbot', require('./routes/chatbot'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Root route - API info
app.get('/', (req, res) => {
  res.json({ 
    message: 'HEALX Health Platform API',
    status: 'Running',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      camps: '/api/camps',
      emergencies: '/api/emergencies',
      ambulances: '/api/ambulances',
      records: '/api/records',
      dashboard: '/api/dashboard',
      notifications: '/api/notifications',
      volunteers: '/api/volunteers',
      reports: '/api/reports',
      chatbot: '/api/chatbot'
    },
    frontend: 'http://localhost:3000'

  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

const PORT = 3000; // All services run on port 3000



server.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ API available at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`✗ Port ${PORT} is already in use. Please try the following:`);
    console.error(`  1. Kill the process using port ${PORT}`);
    console.error(`  2. Or change the PORT in server.js to a different value`);
    console.error(`  3. Or set a different PORT environment variable`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});
