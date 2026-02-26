const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const User = require('../models/User');

router.get('/', auth, authorize('admin', 'doctor'), async (req, res) => {
  try {
    const { availability, page = 1, limit = 10 } = req.query;
    const filter = { role: 'volunteer' };
    if (availability) filter['volunteerInfo.availability'] = availability === 'true';

    const volunteers = await User.find(filter)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);
    res.json({ volunteers, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/nearby', async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query;
    const volunteers = await User.find({
      role: 'volunteer',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: maxDistance
        }
      }
    }).select('-password');

    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const volunteer = await User.findById(req.params.id).select('-password');
    if (!volunteer || volunteer.role !== 'volunteer') {
      return res.status(404).json({ error: 'Volunteer not found' });
    }
    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/availability', auth, async (req, res) => {
  try {
    if (req.userId !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { availability } = req.body;
    const volunteer = await User.findByIdAndUpdate(
      req.params.id,
      { 'volunteerInfo.availability': availability },
      { new: true }
    ).select('-password');

    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/certifications', auth, async (req, res) => {
  try {
    if (req.userId !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { certifications } = req.body;
    const volunteer = await User.findByIdAndUpdate(
      req.params.id,
      { 'volunteerInfo.certifications': certifications },
      { new: true }
    ).select('-password');

    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
