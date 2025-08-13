Attendance Tracker API (Backend Only)
=====================================

Requirements:
  - Node.js (v16+ recommended)
  - MongoDB running locally or a connection string in MONGO_URL

Quick Start:
  1) Install dependencies
       npm install
  2) Start MongoDB (if local)
       - Windows/macOS/Linux: run `mongod`
     Or set MONGO_URL to your MongoDB Atlas connection string
  3) Run the server
       npm start
     You should see:
       MongoDB connected
       Server running on port 3000

Environment (optional):
  - PORT (default 3000)
  - MONGO_URL (default mongodb://127.0.0.1:27017/attendanceDB)

API Endpoints:

  POST /attendance
    Body (JSON):
      {
        "studentId": "123",
        "date": "2025-08-13",
        "status": "Present"   // or "Absent"
      }

  GET /attendance?studentId=123
  GET /attendance?date=2025-08-13
  GET /attendance?studentId=123&date=2025-08-13

Notes:
  - Dates are stored as YYYY-MM-DD strings to avoid timezone issues.
  - Duplicate (studentId, date) is prevented via a unique index.
