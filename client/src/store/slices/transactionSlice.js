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

// Fetch payments
export const fetchPayments = createAsyncThunk(
  'transactions/fetchPayments',
  async ({ page = 1, status = '' }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      if (status) params.append('status', status);
      
      const response = await api.get(`/admin/payments?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payments');
    }
  }
);

// Update payment status
export const updatePaymentStatus = createAsyncThunk(
  'transactions/updateStatus',
  async ({ paymentId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/payments/${paymentId}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update payment status');
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
    payments: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0
    }
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
      })

      // Fetch Payments
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.payments;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalItems
        };
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Payment Status
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        const updatedPayment = action.payload;
        state.payments = state.payments.map(payment => 
          payment.id === updatedPayment.id ? updatedPayment : payment
        );
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
export const selectPayments = (state) => state.transactions.payments;
export const selectPagination = (state) => state.transactions.pagination;