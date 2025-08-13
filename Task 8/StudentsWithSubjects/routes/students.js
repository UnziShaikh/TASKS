const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Add a subject to a student
router.patch('/:id/add-subject', async (req, res) => {
  const { id } = req.params;
  const { subject } = req.body;

  if (!subject) {
    return res.status(400).json({ error: 'Subject is required' });
  }

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (!student.subjects.includes(subject)) {
      student.subjects.push(subject);
      await student.save();
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove a subject from a student
router.patch('/:id/remove-subject', async (req, res) => {
  const { id } = req.params;
  const { subject } = req.body;

  if (!subject) {
    return res.status(400).json({ error: 'Subject is required' });
  }

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    student.subjects = student.subjects.filter(sub => sub !== subject);
    await student.save();

    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get students (optionally filtered by subject)
router.get('/', async (req, res) => {
  const { subject } = req.query;

  try {
    let students;
    if (subject) {
      students = await Student.find({ subjects: subject });
    } else {
      students = await Student.find();
    }

    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Basic CRUD: Create a student (optional)
router.post('/', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;