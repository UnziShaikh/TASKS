const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// --- MongoDB Connection ---
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/attendanceDB';
mongoose.connect(MONGO_URL, { })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// --- Routes ---
const attendanceRoutes = require('./routes/attendance');
app.use('/attendance', attendanceRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
