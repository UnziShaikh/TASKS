const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Helper: normalize any date-like input to YYYY-MM-DD
function toYMD(input) {
  // If already YYYY-MM-DD, return as-is
  if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
  const d = new Date(input);
  if (isNaN(d)) return null;
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

// POST /attendance → Mark attendance
router.post('/', async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    if (!studentId || !date || !status) {
      return res.status(400).json({ message: 'studentId, date, and status are required.' });
    }

    const ymd = toYMD(date);
    if (!ymd) return res.status(400).json({ message: 'Invalid date. Use YYYY-MM-DD.' });

    const attendance = new Attendance({ studentId, date: ymd, status });
    await attendance.save();
    return res.status(201).json(attendance);
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'Attendance already marked for this student on this date.' });
    }
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /attendance?studentId=123
// GET /attendance?date=2025-07-30
router.get('/', async (req, res) => {
  try {
    const { studentId, date } = req.query;
    const filter = {};

    if (studentId) filter.studentId = studentId;
    if (date) {
      const ymd = toYMD(date);
      if (!ymd) return res.status(400).json({ message: 'Invalid date in query. Use YYYY-MM-DD.' });
      filter.date = ymd;
    }

    const records = await Attendance.find(filter).sort({ date: 1, studentId: 1 });
    return res.json(records);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
