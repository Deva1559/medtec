const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  reportType: {
    type: String,
    enum: ['camp_summary', 'emergency_analysis', 'disease_outbreak', 'analytics', 'financial', 'health_risk'],
    required: true
  },
  camp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HealthCamp'
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  period: {
    startDate: Date,
    endDate: Date
  },
  statistics: {
    totalPatients: Number,
    totalEmergencies: Number,
    averageSeverity: Number,
    recoveryRate: Number,
    mortalityRate: Number,
    admissionRate: Number
  },
  diseaseData: [{
    disease: String,
    count: Number,
    percentage: Number,
    trend: String
  }],
  emergencyData: [{
    type: String,
    count: Number,
    averageResponseTime: Number,
    severity: String
  }],
  outbreakPrediction: {
    disease: String,
    riskScore: Number,
    locations: [String],
    recommendation: String
  },
  financialSummary: {
    totalBudget: Number,
    spent: Number,
    balance: Number,
    breakdown: {}
  },
  recommendations: [String],
  attachments: [String],
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  submittedAt: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

reportSchema.index({ reportType: 1 });
reportSchema.index({ createdAt: -1 });
reportSchema.index({ camp: 1 });

module.exports = mongoose.model('Report', reportSchema);
