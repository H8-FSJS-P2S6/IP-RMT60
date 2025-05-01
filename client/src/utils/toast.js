import { toast } from 'react-toastify';

export const showToast = {
  success: (message) => {
    toast.success(message);
  },
  error: (message) => {
    toast.error(message);
  },
  info: (message) => {
    toast.info(message);
  },
  warning: (message) => {
    toast.warning(message);
  }
};

export const showCartToast = {
  empty: () => {
    toast.info('Your cart is empty. Add some courses to get started!', {
      icon: '🛒',
      position: "top-center",
      autoClose: 3000,
      toastId: 'cart-empty' // Prevent duplicate toasts
    });
  },
  itemAdded: (courseName) => {
    toast.success(`${courseName} has been added to your cart!`, {
      position: "bottom-right",
      autoClose: 2000,
      toastId: 'cart-add' // Prevent duplicate toasts
    });
  },
  itemRemoved: () => {
    toast.info('Item has been removed from your cart', {
      position: "bottom-right",
      autoClose: 2000,
      toastId: 'cart-remove' // Prevent duplicate toasts
    });
  },
  error: (message) => {
    toast.error(message || 'Something went wrong with your cart', {
      position: "top-center",
      autoClose: 4000,
      toastId: 'cart-error' // Prevent duplicate toasts
    });
  }
};