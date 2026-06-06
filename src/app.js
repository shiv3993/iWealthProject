const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const performanceRoutes = require("./routes/performanceRoutes");
const historyRoutes = require("./routes/historyRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "NAV API is running 🚀",
    status: "OK",
  });
});

app.use("/api", performanceRoutes);
app.use("/api", historyRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

module.exports = app;