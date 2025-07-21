import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import uiReducer from './slices/uiSlice';
import transactionReducer from './slices/transactionSlice';
import courseReducer from './slices/courseSlice';
import categoryReducer from './slices/categorySlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    ui: uiReducer,
    transactions: transactionReducer,
    courses: courseReducer,
    categories: categoryReducer,
  }
});

export default store;