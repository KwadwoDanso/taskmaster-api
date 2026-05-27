// DEPENDENCIES
require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/connection");
const userRoutes = require("./routes/api/userRoutes");
const projectRoutes = require("./routes/api/projectRoutes");
const taskRoutes = require("./routes/api/taskRoutes");

// Local Environmental Variables
const PORT = process.env.PORT || 3001;

// DATABASE
connectDB();

// MIDDLEWARE
app.use(express.json());

// ROUTES
app.get("/", (req, res) => {
    res.send("TaskMaster API is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", taskRoutes);

// PORT
app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
});