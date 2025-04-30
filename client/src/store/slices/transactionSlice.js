import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const fetchTransactionStatus = createAsyncThunk(
  'transactions/fetchTransactionStatus',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/payments/status/${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transaction status');
    }
  }
);

export const createPayment = createAsyncThunk(
  'transactions/createPayment',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/payments/create');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create payment');
    }
  }
);

export const fetchUserTransactions = createAsyncThunk(
  'transactions/fetchUserTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);

// Transaction slice
const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactions: [],
    currentTransaction: null,
    loading: false,
    error: null,
    paymentStatus: null,
    paymentRedirect: null,
  },
  reducers: {
    clearTransactionError: (state) => {
      state.error = null;
    },
    resetPaymentStatus: (state) => {
      state.paymentStatus = null;
      state.paymentRedirect = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Transaction Status
      .addCase(fetchTransactionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransaction = action.payload;
      })
      .addCase(fetchTransactionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Payment
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStatus = action.payload.payment;
        state.paymentRedirect = action.payload.payment.redirect_url || null;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch User Transactions
      .addCase(fetchUserTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchUserTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTransactionError, resetPaymentStatus } = transactionSlice.actions;

export default transactionSlice.reducer;

// Selectors
export const selectTransactions = (state) => state.transactions.transactions;
export const selectCurrentTransaction = (state) => state.transactions.currentTransaction;
export const selectTransactionLoading = (state) => state.transactions.loading;
export const selectTransactionError = (state) => state.transactions.error;
export const selectPaymentStatus = (state) => state.transactions.paymentStatus;
export const selectPaymentRedirect = (state) => state.transactions.paymentRedirect;