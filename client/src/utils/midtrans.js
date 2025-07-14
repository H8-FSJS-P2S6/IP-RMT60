// Utility function to check if Midtrans Snap is available
export const waitForMidtrans = () => {
  return new Promise((resolve, reject) => {
    // Check if snap is already available
    if (window.snap) {
      resolve(window.snap);
      return;
    }

    // Wait for snap to become available
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait
    
    const checkSnap = setInterval(() => {
      attempts++;
      
      if (window.snap) {
        clearInterval(checkSnap);
        resolve(window.snap);
      } else if (attempts >= maxAttempts) {
        clearInterval(checkSnap);
        reject(new Error('Midtrans Snap script failed to load'));
      }
    }, 100);
  });
};

// Function to initialize payment with error handling
export const initializeMidtransPayment = async (token, callbacks) => {
  try {
    const snap = await waitForMidtrans();
    
    // Enhanced callbacks with error handling
    const enhancedCallbacks = {
      ...callbacks,
      onError: (result) => {
        console.error('Midtrans payment error:', result);
        if (callbacks.onError) {
          callbacks.onError(result);
        }
      },
      onClose: () => {
        console.log('Payment popup closed');
        if (callbacks.onClose) {
          callbacks.onClose();
        }
      }
    };
    
    snap.pay(token, enhancedCallbacks);
  } catch (error) {
    console.error('Failed to initialize Midtrans payment:', error);
    if (callbacks.onError) {
      callbacks.onError(error);
    } else {
      alert('Payment system is currently unavailable. Please try again later.');
    }
  }
};
