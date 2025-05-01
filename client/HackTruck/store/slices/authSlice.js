import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue, dispatch }) => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return { user, token };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed';
    // Set timeout to clear error after 2 seconds
    setTimeout(() => {
      dispatch(clearError());
    }, 2000);
    return rejectWithValue(errorMessage);
  }
});

export const googleLogin = createAsyncThunk('auth/googleLogin', async (credential, { rejectWithValue, dispatch }) => {
  try {
    const response = await api.post('/api/auth/google', { token: credential });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return { user, token };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Google login failed';
    // Set timeout to clear error after 2 seconds
    setTimeout(() => {
      dispatch(clearError());
    }, 2000);
    return rejectWithValue(errorMessage);
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue, dispatch }) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return { user, token };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Registration failed';
    // Set timeout to clear error after 2 seconds
    setTimeout(() => {
      dispatch(clearError());
    }, 2000);
    return rejectWithValue(errorMessage);
  }
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue, dispatch }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No token found');
    }
    const response = await api.get('/api/auth/user'); // Update to the correct endpoint
    return { user: response.data, token };
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    const errorMessage = error.response?.data?.message || 'Authentication failed';
    // Set timeout to clear error after 2 seconds
    if (error.response?.status !== 401) { // Don't show timeout for auth errors
      setTimeout(() => {
        dispatch(clearError());
      }, 2000);
    }
    return rejectWithValue(errorMessage);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        // Only set error if it's not the "No token found" case
        if (action.payload !== 'No token found') {
          state.error = action.payload;
        }
        if (action.payload === 'No token found' || action.meta?.rejectedWithValue) {
          state.user = null;
          state.token = null;
        }
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;