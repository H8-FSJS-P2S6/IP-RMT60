const express = require("express");
const router = express.Router();

// Rute testing dasar
router.get("/health", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

module.exports = router;
