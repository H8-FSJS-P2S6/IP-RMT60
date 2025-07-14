const express = require('express');
const router = express.Router();
const ChatbotController = require('../controllers/chatbotController');

// Route untuk chatbot - tidak memerlukan autentikasi agar dapat diakses oleh semua pengunjung
router.post('/send', ChatbotController.sendMessage);

// Health check endpoint
router.get('/health', ChatbotController.healthCheck);

module.exports = router;