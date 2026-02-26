const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Notification = require('../models/Notification');

const generateNotificationId = () => {
  return 'NOT' + Date.now() + Math.random().toString(36).substr(2, 9);
};

router.post('/', auth, async (req, res) => {
  try {
    const { recipient, type, title, message, priority, channels, relatedData } = req.body;

    const notification = new Notification({
      notificationId: generateNotificationId(),
      recipient,
      sender: req.userId,
      type,
      title,
      message,
      priority,
      channels,
      relatedData
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/user/my-notifications', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const filter = { recipient: req.userId };
    if (unreadOnly === 'true') filter.read = false;

    const notifications = await Notification.find(filter)
      .populate('sender', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(filter);
    res.json({ notifications, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true, readAt: Date.now(), status: 'read' },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats/unread', auth, async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({ 
      recipient: req.userId, 
      read: false 
    });
    res.json({ unreadCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
