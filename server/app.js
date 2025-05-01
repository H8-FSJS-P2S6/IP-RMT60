require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Add these headers for Google Sign-In
app.use((req, res, next) => {
  res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

//middleware body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SNS NDT Learning Platform API");
});

// API routes
app.use("/api", routes);

// Error handler middleware
app.use(errorHandler);

// Add more detailed error logging
app.use((err, req, res, next) => {
  console.error("Error details:", err);
  next(err);
});

// Only listen if directly running this file (not in test environment)
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`SNS NDT Learning Platform API listening on port ${port}`);
  });
}


module.exports = app;
