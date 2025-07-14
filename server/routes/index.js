const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const categoryRoutes = require("./categoryRoutes");
const lectureRoutes = require("./lectureRoutes");
const cartRoutes = require("./cartRoutes");
const publicRoutes = require("./publicRoutes");
const adminRoutes = require("./adminRoutes"); // Tambahkan ini
const transactionRoutes = require("./transactionRoutes"); // Tambahkan ini
const paymentRoutes = require("./paymentRoutes"); // Tambahkan ini
const chatbotRoutes = require("./chatbotRoutes"); // Tambahkan ini
const lessonRoutes = require("./lessonRoutes"); // Tambahkan ini

// Public routes - tidak memerlukan authentication
router.use("/public", publicRoutes);

// Protected routes - memerlukan authentication
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/lectures", lectureRoutes);
router.use("/carts", cartRoutes);
router.use("/admin", adminRoutes); // Tambahkan ini
router.use("/transactions", transactionRoutes); // Tambahkan ini
router.use("/payments", paymentRoutes); // Tambahkan ini
router.use("/chatbot", chatbotRoutes); // Tambahkan ini
router.use("/lessons", lessonRoutes); // Tambahkan ini

module.exports = router;
