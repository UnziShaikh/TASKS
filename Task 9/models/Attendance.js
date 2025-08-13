const mongoose = require('mongoose');

// We'll store `date` as YYYY-MM-DD (string) to avoid timezone issues.
const attendanceSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, trim: true },
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/ // e.g., 2025-07-30
    },
    status: { type: String, enum: ['Present', 'Absent'], required: true }
  },
  { timestamps: true }
);

// Prevent duplicate attendance for a student on the same date
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
