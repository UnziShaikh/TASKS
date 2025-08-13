const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;
const filePath = './todo.json';

app.use(express.json());
app.use(express.static('public'));

function readTasks() {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

function writeTasks(tasks) {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}
app.get('/tasks', (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
});
app.get('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
});
app.post('/tasks', (req, res) => {
    const { title, description, completed } = req.body;
    if (!title || !description || completed === undefined) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const tasks = readTasks();
    const newTask = {
        id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        title,
        description,
        completed
    };

    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
});
app.put('/tasks/:id', (req, res) => {
    const { title, description, completed } = req.body;
    if (!title || !description || completed === undefined) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const tasks = readTasks();
    const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Task not found" });

    tasks[index] = { id: parseInt(req.params.id), title, description, completed };
    writeTasks(tasks);
    res.json(tasks[index]);
});
app.patch('/tasks/:id', (req, res) => {
    const { completed } = req.body;
    if (completed === undefined) {
        return res.status(400).json({ error: "Missing 'completed' field" });
    }

    const tasks = readTasks();
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.completed = completed;
    writeTasks(tasks);
    res.json(task);
});
app.delete('/tasks/:id', (req, res) => {
    let tasks = readTasks();
    const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Task not found" });

    const deleted = tasks.splice(index, 1);
    writeTasks(tasks);
    res.json({ message: "Deleted successfully", task: deleted[0] });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
