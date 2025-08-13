const express = require("express");
const mongoose = require("mongoose");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/task4", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Routes
app.use("/students", studentRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
