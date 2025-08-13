# Mini Library API with Sample Books

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running locally.

3. Start server:
```bash
node server.js
```

4. Add sample books (run once):
Open in browser or Postman:
```
http://localhost:3000/add-sample-books
```

5. View all books:
```
http://localhost:3000/books
```

## API Endpoints

- POST /books
- GET /books
- GET /books/:id
- PUT /books/:id
- PATCH /books/:id
- DELETE /books/:id
- GET /add-sample-books (to add 3 sample books)