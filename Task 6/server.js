const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(express.json());

// GET /students with query params
app.get('/students', (req, res) => {
    fs.readFile('students.json', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Error reading data' });

        let students = JSON.parse(data);
        const { class: classFilter, isActive, age } = req.query;

        if (classFilter) {
            students = students.filter(s => String(s.class) === String(classFilter));
        }

        if (isActive) {
            const boolVal = isActive.toLowerCase() === 'true';
            students = students.filter(s => s.isActive === boolVal);
        }

        if (age) {
            students = students.filter(s => String(s.age) === String(age));
        }

        res.json(students);
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
