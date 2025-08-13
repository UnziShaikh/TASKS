const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

let students = require("./students.json");

function saveData() {
    fs.writeFileSync("./students.json", JSON.stringify(students, null, 2));
}

app.post("/students", (req, res) => {
    const newStudent = { id: Date.now(), ...req.body };
    students.push(newStudent);
    saveData();
    res.status(201).json(newStudent);
});

app.get("/students", (req, res) => {
    let result = students;
    const { class: cls, isActive, age, subject } = req.query;

    if (cls) result = result.filter(s => String(s.class) === String(cls));
    if (isActive) result = result.filter(s => String(s.isActive) === String(isActive));
    if (age) result = result.filter(s => String(s.age) === String(age));
    if (subject) result = result.filter(s => s.subjects.includes(subject));

    res.json(result);
});

app.get("/students/:id", (req, res) => {
    const student = students.find(s => s.id == req.params.id);
    if (!student) return res.status(404).json({ message: "Not found" });
    res.json(student);
});

app.put("/students/:id", (req, res) => {
    const index = students.findIndex(s => s.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: "Not found" });

    students[index] = { id: students[index].id, ...req.body };
    saveData();
    res.json(students[index]);
});

app.patch("/students/:id", (req, res) => {
    const index = students.findIndex(s => s.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: "Not found" });

    students[index] = { ...students[index], ...req.body };
    saveData();
    res.json(students[index]);
});

app.delete("/students/:id", (req, res) => {
    students = students.filter(s => s.id != req.params.id);
    saveData();
    res.json({ message: "Deleted successfully" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
