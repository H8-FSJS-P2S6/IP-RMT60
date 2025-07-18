const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const authentication = require('../middlewares/authentication');
const { adminAuthorization } = require('../middlewares/authorization');

// Create manual payment (WhatsApp + Bank Transfer)
router.post('/manual/create', authentication, PaymentController.createManualPayment);

// Confirm manual payment (admin only)
router.patch('/manual/confirm/:invoice_number', authentication, adminAuthorization, PaymentController.confirmManualPayment);

// Check payment status (requires authentication)
router.get('/status/:invoice', authentication, PaymentController.getPaymentStatus);

// ====== PAYMENT GATEWAY ROUTES (COMMENTED FOR NOW) ======
/*
// Create payment (requires authentication)
router.post('/create', authentication, PaymentController.createPayment);

// Handle notifications from Midtrans
router.post('/notification', PaymentController.handleNotification);
*/
// ====== END OF COMMENTED PAYMENT GATEWAY ROUTES ======

module.exports = router;