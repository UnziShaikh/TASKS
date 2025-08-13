const express = require('express');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const app = express();

const PORT = 3000;
const DATA_FILE = 'users.json';

app.use(bodyParser.json());

// Helper: Read users from file
function readUsers() {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
}

// Helper: Save users to file
function saveUsers(users) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 4));
}

// POST /register → Register new user
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const users = readUsers();
    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { name, email, password: hashedPassword };
    users.push(newUser);
    saveUsers(users);

    res.status(201).json({ message: 'User registered successfully' });
});

// GET /users → Get all users (no passwords)
app.get('/users', (req, res) => {
    const users = readUsers();
    const sanitizedUsers = users.map(({ password, ...rest }) => rest);
    res.json(sanitizedUsers);
});

// GET /users/:email → Get user by email (no password)
app.get('/users/:email', (req, res) => {
    const users = readUsers();
    const user = users.find(u => u.email === req.params.email);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

// DELETE /users/:email → Delete user by email
app.delete('/users/:email', (req, res) => {
    const users = readUsers();
    const index = users.findIndex(u => u.email === req.params.email);

    if (index === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    users.splice(index, 1);
    saveUsers(users);

    res.json({ message: 'User deleted successfully' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
