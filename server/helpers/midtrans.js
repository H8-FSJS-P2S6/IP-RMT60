const midtransClient = require('midtrans-client');

// Create Snap API instance
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// Create Core API instance (for handling notifications)
const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// Function to create transaction token
const createPaymentToken = async (transaction) => {
  const { id, invoice_number, total_amount, User } = transaction;
  
  const parameter = {
    transaction_details: {
      order_id: invoice_number,
      gross_amount: total_amount
    },
    credit_card: {
      secure: true
    },
    customer_details: {
      first_name: User.username || 'Customer',
      email: User.email,
      phone: User.phoneNumber || ''
    },
    callbacks: {
      finish: `${process.env.CLIENT_URL}/payment/success?order_id=${invoice_number}`,
      error: `${process.env.CLIENT_URL}/payment/failed?order_id=${invoice_number}`,
      pending: `${process.env.CLIENT_URL}/payment/pending?order_id=${invoice_number}`
    }
  };
  
  try {
    const transaction = await snap.createTransaction(parameter);
    return {
      token: transaction.token,
      redirect_url: transaction.redirect_url
    };
  } catch (error) {
    console.error('Error creating Midtrans transaction:', error);
    throw error;
  }
};

// Function to handle webhook notifications
const handleNotification = async (notificationJson) => {
  try {
    const statusResponse = await coreApi.transaction.notification(notificationJson);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

    // Return the details as an object for further processing
    return {
      orderId,
      transactionStatus,
      fraudStatus,
      statusResponse
    };
  } catch (error) {
    console.error('Error handling notification:', error);
    throw error;
  }
};

module.exports = {
  createPaymentToken,
  handleNotification
};