// Test script for manual payment functionality
const PaymentController = require('./controllers/paymentController');

// Mock request and response objects for testing
const mockReq = {
  user: {
    id: 1,
    username: 'testuser',
    email: 'test@example.com'
  },
  body: {},
  params: {}
};

const mockRes = {
  status: function(code) {
    console.log(`Response status: ${code}`);
    return this;
  },
  json: function(data) {
    console.log('Response data:', JSON.stringify(data, null, 2));
    return this;
  }
};

const mockNext = function(error) {
  if (error) {
    console.error('Error:', error);
  }
};

console.log('Manual Payment Controller Test');
console.log('Available methods:', Object.getOwnPropertyNames(PaymentController).filter(name => typeof PaymentController[name] === 'function'));

// Test that methods exist
console.log('createManualPayment exists:', typeof PaymentController.createManualPayment === 'function');
console.log('confirmManualPayment exists:', typeof PaymentController.confirmManualPayment === 'function');
console.log('getPaymentStatus exists:', typeof PaymentController.getPaymentStatus === 'function');

console.log('\nTest completed successfully!');
