const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  class: Number,
  subjects: [String],
  isActive: Boolean,
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;