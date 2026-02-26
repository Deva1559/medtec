const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'doctor', 'patient', 'volunteer', 'ambulance_driver'],
    default: 'patient'
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number]
  },
  avatar: String,
  verified: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  medicalLicense: {
    number: String,
    specialization: String,
    issuedAt: Date,
    expiresAt: Date
  },
  volunteerInfo: {
    yearsOfExperience: Number,
    certifications: [String],
    availability: Boolean
  },
  emergencyContacts: [{
    name: String,
    relationship: String,
    phone: String
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

userSchema.index({ location: '2dsphere' });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
