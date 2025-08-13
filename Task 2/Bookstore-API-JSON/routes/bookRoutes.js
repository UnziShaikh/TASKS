const express = require('express');
const fs = require('fs-extra');
const router = express.Router();
const filePath = './data/books.json';

// Helper to read data
const readBooks = async () => {
    const data = await fs.readJson(filePath);
    return data;
};

// Helper to write data
const writeBooks = async (data) => {
    await fs.writeJson(filePath, data, { spaces: 4 });
};

// GET all books
router.get('/', async (req, res) => {
    const books = await readBooks();
    res.json(books);
});

// GET book by ID
router.get('/:id', async (req, res) => {
    const books = await readBooks();
    const book = books.find(b => b.id === parseInt(req.params.id));
    book ? res.json(book) : res.status(404).json({ error: 'Book not found' });
});

// POST new book
router.post('/', async (req, res) => {
    const { title, author, genre, price } = req.body;
    if (!title || !author || !genre || typeof price !== 'number') {
        return res.status(400).json({ error: 'Invalid book data' });
    }
    const books = await readBooks();
    const newBook = {
        id: books.length ? books[books.length - 1].id + 1 : 1,
        title, author, genre, price
    };
    books.push(newBook);
    await writeBooks(books);
    res.status(201).json(newBook);
});

// PUT update book
router.put('/:id', async (req, res) => {
    const { title, author, genre, price } = req.body;
    if (!title || !author || !genre || typeof price !== 'number') {
        return res.status(400).json({ error: 'Invalid book data' });
    }
    const books = await readBooks();
    const index = books.findIndex(b => b.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Book not found' });

    books[index] = { id: books[index].id, title, author, genre, price };
    await writeBooks(books);
    res.json(books[index]);
});

// PATCH update book price
router.patch('/:id', async (req, res) => {
    const { price } = req.body;
    if (typeof price !== 'number') {
        return res.status(400).json({ error: 'Invalid price' });
    }
    const books = await readBooks();
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).json({ error: 'Book not found' });

    book.price = price;
    await writeBooks(books);
    res.json(book);
});

// DELETE book
router.delete('/:id', async (req, res) => {
    let books = await readBooks();
    const index = books.findIndex(b => b.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Book not found' });

    const deleted = books.splice(index, 1);
    await writeBooks(books);
    res.json({ message: 'Book deleted', book: deleted[0] });
});

module.exports = router;
