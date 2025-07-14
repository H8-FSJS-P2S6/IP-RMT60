import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await api.post('/transactions', transactionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create transaction');
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.status) queryParams.append('status', params.status);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      
      const response = await api.get(`/transactions?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);

export const fetchTransactionById = createAsyncThunk(
  'transactions/fetchTransactionById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transaction');
    }
  }
);

// Alias for payment status checking
export const fetchTransactionStatus = fetchTransactionById;

export const processPayment = createAsyncThunk(
  'transactions/processPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/payment/process', paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Payment processing failed');
    }
  }
);

// Alias for backward compatibility
export { processPayment as createPayment };

// Admin thunks
export const fetchAllTransactions = createAsyncThunk(
  'transactions/fetchAllTransactions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.status) queryParams.append('status', params.status);
      if (params.search) queryParams.append('search', params.search);
      
      const response = await api.get(`/admin/transactions?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);

export const updateTransactionStatus = createAsyncThunk(
  'transactions/updateTransactionStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/transactions/${id}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update transaction status');
    }
  }
);

const initialState = {
  list: [],
  currentTransaction: null,
  loading: false,
  error: null,
  success: false,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
  paymentRedirect: null,
  paymentStatus: null,
  filters: {
    status: '',
    startDate: '',
    endDate: '',
    search: '',
  },
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearTransactionError: (state) => {
      state.error = null;
    },
    clearTransactionSuccess: (state) => {
      state.success = false;
    },
    setTransactionFilters: (state, action) => {
      state.filters = action.payload;
      state.pagination.currentPage = 1;
    },
    setTransactionPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    resetPaymentStatus: (state) => {
      state.paymentStatus = null;
      state.paymentRedirect = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Transaction
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransaction = action.payload;
        state.success = true;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.transactions || action.payload;
        if (action.payload.pagination) {
          state.pagination = {
            currentPage: action.payload.currentPage || 1,
            totalPages: action.payload.totalPages || 1,
            totalItems: action.payload.totalItems || action.payload.transactions?.length || 0,
          };
        }
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Transaction By ID
      .addCase(fetchTransactionById.pending, (state) => {
        state.loading = true;
        state.currentTransaction = null;
        state.error = null;
      })
      .addCase(fetchTransactionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransaction = action.payload;
      })
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Process Payment / Create Payment (both names for same action)
      .addCase(processPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentRedirect = action.payload.redirectUrl;
        state.paymentStatus = 'success';
        state.success = true;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.paymentStatus = 'failed';
      })
      
      // Admin: Fetch All Transactions
      .addCase(fetchAllTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.transactions || action.payload;
        if (action.payload.pagination) {
          state.pagination = {
            currentPage: action.payload.currentPage || 1,
            totalPages: action.payload.totalPages || 1,
            totalItems: action.payload.totalItems || action.payload.transactions?.length || 0,
          };
        }
      })
      .addCase(fetchAllTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Transaction Status
      .addCase(updateTransactionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransactionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Update the transaction in the list
        const index = state.list.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        // Update current transaction if it's the same
        if (state.currentTransaction?.id === action.payload.id) {
          state.currentTransaction = action.payload;
        }
      })
      .addCase(updateTransactionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearTransactionError,
  clearTransactionSuccess,
  setTransactionFilters,
  setTransactionPage,
  resetPaymentStatus
} = transactionSlice.actions;

export default transactionSlice.reducer;

// Selectors
export const selectTransactions = (state) => state.transactions.list;
export const selectCurrentTransaction = (state) => state.transactions.currentTransaction;
export const selectTransactionLoading = (state) => state.transactions.loading;
export const selectTransactionError = (state) => state.transactions.error;
export const selectTransactionSuccess = (state) => state.transactions.success;
export const selectTransactionPagination = (state) => state.transactions.pagination;
export const selectTransactionFilters = (state) => state.transactions.filters;
export const selectPaymentRedirect = (state) => state.transactions.paymentRedirect;
export const selectPaymentStatus = (state) => state.transactions.paymentStatus;

// Export fetchAllTransactions as fetchTransactions for admin pages
export { fetchAllTransactions as fetchAdminTransactions };
