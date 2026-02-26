const mongoose = require('mongoose');

const healthCampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['general', 'vaccination', 'dental', 'eye_care', 'maternal', 'pediatric', 'cardiac'],
    default: 'general'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number]
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  volunteers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  patients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  services: [String],
  capacity: Number,
  registeredCount: {
    type: Number,
    default: 0
  },
  budget: Number,
  status: {
    type: String,
    enum: ['planned', 'ongoing', 'completed', 'cancelled'],
    default: 'planned'
  },
  photos: [String],
  reports: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

healthCampSchema.index({ location: '2dsphere' });
healthCampSchema.index({ startDate: 1, endDate: 1 });
healthCampSchema.index({ status: 1 });

module.exports = mongoose.model('HealthCamp', healthCampSchema);
