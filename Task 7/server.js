const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mini-library', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  availableCopies: Number,
  publishedYear: Number,
});

const Book = mongoose.model('Book', bookSchema);

// Add sample books route (runs once)
app.get('/add-sample-books', async (req, res) => {
  const sampleBooks = [
    { title: "Harry Potter", author: "J.K. Rowling", genre: "fiction", availableCopies: 5, publishedYear: 1997 },
    { title: "Atomic Habits", author: "James Clear", genre: "self-help", availableCopies: 3, publishedYear: 2018 },
    { title: "The Alchemist", author: "Paulo Coelho", genre: "fiction", availableCopies: 2, publishedYear: 1988 }
  ];
  await Book.insertMany(sampleBooks);
  res.send("3 sample books added!");
});

// CRUD routes
app.post('/books', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/books', async (req, res) => {
  try {
    const query = {};
    if (req.query.genre) query.genre = req.query.genre;
    if (req.query.availableCopies && req.query.availableCopies.gte) {
      query.availableCopies = { $gte: Number(req.query.availableCopies.gte) };
    }
    const books = await Book.find(query);
    res.json(books);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.patch('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));