const mongoose = require('mongoose');

const ambulanceSchema = new mongoose.Schema({
  ambulanceId: {
    type: String,
    unique: true,
    required: true
  },
  registrationNumber: {
    type: String,
    unique: true,
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assistant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number]
  },
  address: String,
  baseStation: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'on_duty', 'in_emergency', 'maintenance', 'offline'],
    default: 'available'
  },
  equipment: [String],
  capacity: {
    type: Number,
    default: 2
  },
  currentPatients: {
    type: Number,
    default: 0
  },
  assignedEmergency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Emergency'
  },
  model: String,
  year: Number,
  features: [String],
  lastMaintenanceDate: Date,
  fuelLevel: {
    type: Number,
    min: 0,
    max: 100
  },
  locationHistory: [{
    coordinates: [Number],
    timestamp: Date
  }],
  routeOptimization: {
    enabled: Boolean,
    estimatedTime: Number,
    distance: Number,
    route: [{}]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

ambulanceSchema.index({ location: '2dsphere' });
ambulanceSchema.index({ status: 1 });
ambulanceSchema.index({ driver: 1 });
ambulanceSchema.index({ 'locationHistory.timestamp': -1 });

module.exports = mongoose.model('Ambulance', ambulanceSchema);
