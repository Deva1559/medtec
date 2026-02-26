const Notification = require('../models/Notification');
const Emergency = require('../models/Emergency');

exports.sendEmergencyNotification = async (emergency, ambulance) => {
  try {
    const recipients = await Emergency.findById(emergency._id)
      .populate('caller')
      .populate('patient');

    const notification = new Notification({
      notificationId: 'NOT' + Date.now(),
      recipient: emergency.caller,
      type: 'emergency_alert',
      title: 'Emergency Response Dispatched',
      message: `Ambulance ${ambulance.ambulanceId} has been assigned to your emergency`,
      priority: 'critical',
      relatedData: {
        emergency: emergency._id,
        ambulance: ambulance._id
      }
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Notification error:', error);
  }
};

exports.sendCampNotification = async (userId, camp) => {
  const notification = new Notification({
    notificationId: 'NOT' + Date.now(),
    recipient: userId,
    type: 'camp_update',
    title: `${camp.name} Update`,
    message: `There's an update about your registered health camp`,
    priority: 'medium',
    relatedData: {
      camp: camp._id
    }
  });

  await notification.save();
  return notification;
};

exports.sendOutbreakAlert = async (users, disease, location) => {
  const notifications = users.map(userId => ({
    notificationId: 'NOT' + Date.now(),
    recipient: userId,
    type: 'outbreak_alert',
    title: 'Disease Outbreak Alert',
    message: `Alert: ${disease} outbreak reported in ${location}. Take precautions.`,
    priority: 'high'
  }));

  return await Notification.insertMany(notifications);
};
