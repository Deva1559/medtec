const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Report = require('../models/Report');
const HealthCamp = require('../models/HealthCamp');
const Emergency = require('../models/Emergency');
const MedicalRecord = require('../models/MedicalRecord');

const generateReportId = () => {
  return 'RPT' + Date.now() + Math.random().toString(36).substr(2, 9);
};

router.post('/', auth, authorize('admin', 'doctor'), async (req, res) => {
  try {
    const { title, reportType, camp, period, statistics } = req.body;

    const report = new Report({
      reportId: generateReportId(),
      title,
      reportType,
      camp,
      generatedBy: req.userId,
      period,
      statistics,
      status: 'draft'
    });

    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { reportType, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (reportType) filter.reportType = reportType;

    const reports = await Report.find(filter)
      .populate('generatedBy', 'firstName lastName')
      .populate('camp', 'name type')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Report.countDocuments(filter);
    res.json({ reports, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/camp/:campId/summary', auth, async (req, res) => {
  try {
    const camp = await HealthCamp.findById(req.params.campId);
    if (!camp) return res.status(404).json({ error: 'Camp not found' });

    const records = await MedicalRecord.find({ camp: req.params.campId });
    const emergencies = await Emergency.find({ 
      createdAt: { $gte: camp.startDate, $lte: camp.endDate }
    });

    const diseaseData = {};
    records.forEach(record => {
      if (record.diagnosis) {
        diseaseData[record.diagnosis] = (diseaseData[record.diagnosis] || 0) + 1;
      }
    });

    const report = new Report({
      reportId: generateReportId(),
      title: `${camp.name} Camp Report`,
      reportType: 'camp_summary',
      camp: req.params.campId,
      generatedBy: req.userId,
      period: { startDate: camp.startDate, endDate: camp.endDate },
      statistics: {
        totalPatients: camp.patients.length,
        totalRecords: records.length,
        totalEmergencies: emergencies.length
      },
      diseaseData: Object.entries(diseaseData).map(([disease, count]) => ({
        disease,
        count,
        percentage: ((count / records.length) * 100).toFixed(2)
      }))
    });

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
