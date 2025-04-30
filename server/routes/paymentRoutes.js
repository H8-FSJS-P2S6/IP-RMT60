const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const authentication = require('../middlewares/authentication');

// Create payment (requires authentication)
router.post('/create', authentication, PaymentController.createPayment);

// Check payment status (requires authentication)
router.get('/status/:invoice', authentication, PaymentController.getPaymentStatus);

// Handle notifications from Midtrans
router.post('/notification', PaymentController.handleNotification);

module.exports = router;