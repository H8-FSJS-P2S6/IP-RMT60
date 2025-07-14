const express = require('express');
const router = express.Router();
const ChatbotController = require('../controllers/chatbotController');

// Route for chatbot - does not require authentication so it can be accessed by all visitors
router.post('/send', ChatbotController.sendMessage);

// Health check endpoint
router.get('/health', ChatbotController.healthCheck);

module.exports = router;