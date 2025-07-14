const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const categoryRoutes = require("./categoryRoutes");
const lectureRoutes = require("./lectureRoutes");
const cartRoutes = require("./cartRoutes");
const publicRoutes = require("./publicRoutes");
const adminRoutes = require("./adminRoutes"); // Add this
const transactionRoutes = require("./transactionRoutes"); // Add this
const paymentRoutes = require("./paymentRoutes"); // Add this
const chatbotRoutes = require("./chatbotRoutes"); // Add this
const lessonRoutes = require("./lessonRoutes"); // Add this

// Public routes - do not require authentication
router.use("/public", publicRoutes);

// Protected routes - require authentication
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/lectures", lectureRoutes);
router.use("/carts", cartRoutes);
router.use("/admin", adminRoutes); // Add this
router.use("/transactions", transactionRoutes); // Add this
router.use("/payments", paymentRoutes); // Add this
router.use("/chatbot", chatbotRoutes); // Add this
router.use("/lessons", lessonRoutes); // Add this

module.exports = router;
