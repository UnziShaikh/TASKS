const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const PORT = 3000;
const FILE_PATH = './books.json';

// Get all books with optional filters
app.get('/books', (req, res) => {
  const { author, genre, minPrice, maxPrice } = req.query;

  // Load books
  const books = JSON.parse(fs.readFileSync(FILE_PATH));

  // Filter logic
  let filteredBooks = books;

  if (author) {
    filteredBooks = filteredBooks.filter(book =>
      book.author.toLowerCase() === author.toLowerCase()
    );
  }

  if (genre) {
    filteredBooks = filteredBooks.filter(book =>
      book.genre.toLowerCase() === genre.toLowerCase()
    );
  }

  if (minPrice || maxPrice) {
    filteredBooks = filteredBooks.filter(book => {
      const price = book.price;
      if (minPrice && price < parseFloat(minPrice)) return false;
      if (maxPrice && price > parseFloat(maxPrice)) return false;
      return true;
    });
  }

  res.json(filteredBooks);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});