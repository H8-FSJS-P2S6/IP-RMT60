const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const categoryRoutes = require("./categoryRoutes");
const lectureRoutes = require("./lectureRoutes");
const cartRoutes = require("./cartRoutes");
const publicRoutes = require("./publicRoutes");
const adminRoutes = require("./adminRoutes"); // Tambahkan ini

// Public routes - tidak memerlukan authentication
router.use("/public", publicRoutes);

// Protected routes - memerlukan authentication
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/lectures", lectureRoutes);
router.use("/carts", cartRoutes);
router.use("/admin", adminRoutes); // Tambahkan ini

module.exports = router;