const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  emergencyId: {
    type: String,
    unique: true,
    required: true
  },
  caller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  emergencyType: {
    type: String,
    enum: ['trauma', 'cardiac', 'respiratory', 'stroke', 'burns', 'poisoning', 'other'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  predictedSeverity: {
    score: Number,
    confidence: Number,
    prediction: String
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
  description: String,
  symptoms: [String],
  vitals: {
    heartRate: Number,
    bloodPressure: String,
    temperature: Number,
    respirationRate: Number,
    oxygenLevel: Number
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedAmbulance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ambulance'
  },
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'arrived', 'in_transit', 'at_hospital', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  arrivedAt: Date,
  completedAt: Date,
  timeline: [{
    status: String,
    timestamp: Date,
    notes: String
  }],
  cost: Number,
  insuranceInfo: String,
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

emergencySchema.index({ location: '2dsphere' });
emergencySchema.index({ status: 1, severity: 1 });
emergencySchema.index({ createdAt: -1 });
emergencySchema.index({ caller: 1 });

module.exports = mongoose.model('Emergency', emergencySchema);
