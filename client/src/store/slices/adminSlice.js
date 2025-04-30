import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/statistics');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard statistics');
    }
  }
);

export const fetchRecentUsers = createAsyncThunk(
  'admin/fetchRecentUsers',
  async (limit = 5, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/recent-users?limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recent users');
    }
  }
);

export const fetchRecentOrders = createAsyncThunk(
  'admin/fetchRecentOrders',
  async (limit = 5, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/orders?limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recent orders');
    }
  }
);

export const fetchCategoryStats = createAsyncThunk(
  'admin/fetchCategoryStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/categories/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch category statistics');
    }
  }
);

export const fetchMonthlySales = createAsyncThunk(
  'admin/fetchMonthlySales',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/orders/monthly');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch monthly sales');
    }
  }
);

// User management async thunks
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async ({ page = 1, search = '' }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/users?page=${page}&search=${search}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const createUser = createAsyncThunk(
  'admin/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/users/${userData.id}`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      return userId; // Return the ID to remove from state
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

export const setUserPage = createAsyncThunk(
  'admin/setUserPage',
  async (page, { dispatch }) => {
    dispatch(setPage(page));
  }
);

export const setUserSearch = createAsyncThunk(
  'admin/setUserSearch',
  async (search, { dispatch }) => {
    dispatch(setSearch(search));
  }
);

// Admin slice
const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: {
      totalUsers: 0,
      totalCourses: 0,
      totalCategories: 0,
      totalOrders: 0,
      revenue: 0,
    },
    recentUsers: [],
    recentOrders: [],
    categoryStats: [],
    monthlySales: [],
    users: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
    },
    searchTerm: '',
    success: false,
  },
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setSearch: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Dashboard stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Recent users
      .addCase(fetchRecentUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecentUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.recentUsers = action.payload;
      })
      .addCase(fetchRecentUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Recent orders
      .addCase(fetchRecentOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.recentOrders = action.payload;
      })
      .addCase(fetchRecentOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Category stats
      .addCase(fetchCategoryStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategoryStats.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryStats = action.payload;
      })
      .addCase(fetchCategoryStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Monthly sales
      .addCase(fetchMonthlySales.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMonthlySales.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlySales = action.payload;
      })
      .addCase(fetchMonthlySales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalItems
        };
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  }
});

export const { clearAdminError, setPage, setSearch, setSuccess } = adminSlice.actions;

export default adminSlice.reducer;

// Selectors
export const selectDashboardStats = (state) => state.admin.stats;
export const selectRecentUsers = (state) => state.admin.recentUsers;
export const selectRecentOrders = (state) => state.admin.recentOrders;
export const selectCategoryStats = (state) => state.admin.categoryStats;
export const selectMonthlySales = (state) => state.admin.monthlySales;

// User management selectors
export const selectUsers = (state) => state.admin.users;
export const selectUserLoading = (state) => state.admin.loading;
export const selectUserError = (state) => state.admin.error;
export const selectUserPagination = (state) => state.admin.pagination;
export const selectUserSuccess = (state) => state.admin.success;
export const selectUserSearchTerm = (state) => state.admin.searchTerm;

// Dashboard specific selectors
export const selectDashboardLoading = (state) => state.admin.loading;
export const selectDashboardError = (state) => state.admin.error;