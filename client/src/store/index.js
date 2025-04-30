import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import courseReducer from './slices/courseSlice';
import categoryReducer from './slices/categorySlice';
import uiReducer from './slices/uiSlice';
import adminReducer from './slices/adminSlice';
import transactionReducer from './slices/transactionSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    courses: courseReducer,
    categories: categoryReducer,
    ui: uiReducer,
    admin: adminReducer,
    transactions: transactionReducer
  }
});

export default store;