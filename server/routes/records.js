const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const MedicalRecord = require('../models/MedicalRecord');

const generateRecordId = () => {
  return 'REC' + Date.now() + Math.random().toString(36).substr(2, 9);
};

router.post('/', auth, authorize('doctor'), async (req, res) => {
  try {
    const { patient, recordType, diagnosis, prescription, vitals, labTests } = req.body;
    
    const record = new MedicalRecord({
      recordId: generateRecordId(),
      patient,
      doctor: req.userId,
      recordType,
      diagnosis,
      prescription,
      vitals,
      labTests
    });

    await record.save();
    await record.populate('doctor', 'firstName lastName medicalLicense');
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { patient, doctor, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (patient) filter.patient = patient;
    if (doctor) filter.doctor = doctor;

    const records = await MedicalRecord.find(filter)
      .populate('patient', 'firstName lastName email')
      .populate('doctor', 'firstName lastName medicalLicense')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MedicalRecord.countDocuments(filter);
    res.json({ records, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/patient/:patientId', auth, async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.params.patientId })
      .populate('doctor', 'firstName lastName medicalLicense')
      .sort({ createdAt: -1 });

    res.json({ records });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patient', 'firstName lastName email phone')
      .populate('doctor', 'firstName lastName medicalLicense');

    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, authorize('doctor'), async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    Object.assign(record, req.body);
    record.updatedAt = Date.now();
    await record.save();
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
