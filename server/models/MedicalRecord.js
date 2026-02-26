const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  recordId: {
    type: String,
    unique: true,
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recordType: {
    type: String,
    enum: ['prescription', 'diagnosis', 'lab_report', 'imaging', 'vaccine', 'other'],
    required: true
  },
  diagnosis: String,
  symptoms: [String],
  prescription: [{
    medicine: String,
    dosage: String,
    frequency: String,
    duration: String,
    notes: String
  }],
  vitals: {
    heartRate: Number,
    bloodPressure: String,
    temperature: Number,
    respirationRate: Number,
    weight: Number,
    height: Number,
    bmi: Number,
    oxygenLevel: Number
  },
  labTests: [{
    testName: String,
    result: String,
    unit: String,
    referenceRange: String,
    abnormal: Boolean
  }],
  imaging: [{
    type: String,
    imageUrl: String,
    findings: String
  }],
  allergies: [String],
  medicalHistory: [String],
  visitReason: String,
  treatmentPlan: String,
  notes: String,
  followUpDate: Date,
  attachments: [String],
  isConfidential: {
    type: Boolean,
    default: false
  },
  camp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HealthCamp'
  },
  emergency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Emergency'
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

medicalRecordSchema.index({ patient: 1 });
medicalRecordSchema.index({ doctor: 1 });
medicalRecordSchema.index({ createdAt: -1 });
medicalRecordSchema.index({ recordType: 1 });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
