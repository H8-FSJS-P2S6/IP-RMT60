require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

app.use(cors());
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

// Di bagian akhir sebelum module.exports
app.use(require("./middlewares/errorHandler"));

module.exports = app;
