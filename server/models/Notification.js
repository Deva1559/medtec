const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notificationId: {
    type: String,
    unique: true,
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['emergency_alert', 'camp_update', 'appointment', 'message', 'system', 'reminder', 'outbreak_alert'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  relatedData: {
    emergency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Emergency'
    },
    camp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HealthCamp'
    },
    ambulance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ambulance'
    }
  },
  channels: {
    inApp: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    },
    whatsapp: {
      type: Boolean,
      default: false
    },
    voiceCall: {
      type: Boolean,
      default: false
    }
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'read', 'failed'],
    default: 'pending'
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  actionUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  deliveredAt: Date,
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ status: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
