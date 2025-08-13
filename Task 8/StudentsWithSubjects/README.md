# Task 4: Student Management with Subjects

## Setup Instructions

1. Make sure you have MongoDB installed and running on your machine.
2. Clone this project or unzip the folder.
3. Run `npm install` to install dependencies.
4. Start the server:
   - `npm run dev` (recommended, uses nodemon)
   - or `npm start`

The server will run on port 5000 by default.

## API Endpoints

- POST /students
  - Create a new student (fields: name, age, class, subjects (array), isActive)

- GET /students
  - Get all students, or filter by subject with query param, e.g., `/students?subject=Math`

- PATCH /students/:id/add-subject
  - Add a subject to student (body: `{ "subject": "Math" }`)

- PATCH /students/:id/remove-subject
  - Remove a subject from student (body: `{ "subject": "Math" }`)

## Example

Create a student:
```
POST /students
{
  "name": "Ali",
  "age": 15,
  "class": 10,
  "subjects": ["English", "Science"],
  "isActive": true
}
```

Add subject:
```
PATCH /students/<id>/add-subject
{
  "subject": "Math"
}
```

Fetch students with Math subject:
```
GET /students?subject=Math
```