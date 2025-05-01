import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (params, { rejectWithValue }) => {
  try {
    const response = await api.get('/api/posts', { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to fetch posts' });
  }
});

export const fetchDriverPosts = createAsyncThunk('posts/fetchDriverPosts', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/api/posts/driver');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to fetch driver posts' });
  }
});

export const createPost = createAsyncThunk('posts/createPost', async (postData, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/posts', postData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create post');
  }
});

export const updatePost = createAsyncThunk('posts/updatePost', async ({ id, postData }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/posts/${id}`, postData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to update post' });
  }
});

export const deletePost = createAsyncThunk('posts/deletePost', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/api/posts/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to delete post' });
  }
});

export const getTruckRecommendation = createAsyncThunk('posts/getTruckRecommendation', async (weight, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/ai/recommend', { weight });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to get recommendation' });
  }
});

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    driverPosts: [],
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    recommendation: null,
  },
  reducers: {
    clearRecommendation: (state) => {
      state.recommendation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchDriverPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.driverPosts = action.payload;
      })
      .addCase(fetchDriverPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.driverPosts.push(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.driverPosts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.driverPosts[index] = action.payload;
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.driverPosts = state.driverPosts.filter(post => post.id !== action.payload);
      })
      .addCase(getTruckRecommendation.fulfilled, (state, action) => {
        state.recommendation = action.payload.recommendation;
      });
  },
});

export const { clearRecommendation } = postSlice.actions;
export default postSlice.reducer;