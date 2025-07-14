import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);
      if (params.level) queryParams.append('level', params.level);
      if (params.status) queryParams.append('status', params.status);
      if (params.minPrice) queryParams.append('minPrice', params.minPrice);
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
      
      const response = await api.get(`/public/lectures?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/public/lectures/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch course');
    }
  }
);

export const fetchUserCourses = createAsyncThunk(
  'courses/fetchUserCourses',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.status) queryParams.append('status', params.status);
      
      const response = await api.get(`/user/courses?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user courses');
    }
  }
);

// Admin thunks
export const fetchAllCourses = createAsyncThunk(
  'courses/fetchAllCourses',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);
      if (params.status) queryParams.append('status', params.status);
      
      const response = await api.get(`/admin/lectures?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

export const createCourse = createAsyncThunk(
  'courses/createCourse',
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/lectures', courseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create course');
    }
  }
);

export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ id, courseData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/lectures/${id}`, courseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update course');
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/lectures/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete course');
    }
  }
);

export const updateCourseStatus = createAsyncThunk(
  'courses/updateCourseStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/lectures/${id}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update course status');
    }
  }
);

const initialState = {
  list: [],
  userCourses: [],
  currentCourse: null,
  loading: false,
  error: null,
  success: false,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
  filters: {
    search: '',
    category: '',
    level: '',
    status: '',
    minPrice: '',
    maxPrice: '',
  },
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearCourseError: (state) => {
      state.error = null;
    },
    clearCourseSuccess: (state) => {
      state.success = false;
    },
    setCourseFilters: (state, action) => {
      state.filters = action.payload;
      state.pagination.currentPage = 1;
    },
    setCoursePage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setCurrentCourse: (state, action) => {
      state.currentCourse = action.payload;
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.lectures || action.payload;
        if (action.payload.pagination) {
          state.pagination = {
            currentPage: action.payload.currentPage || 1,
            totalPages: action.payload.totalPages || 1,
            totalItems: action.payload.totalItems || action.payload.lectures?.length || 0,
          };
        }
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Course By ID
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.currentCourse = null;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch User Courses
      .addCase(fetchUserCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.userCourses = action.payload.courses || action.payload;
      })
      .addCase(fetchUserCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Admin: Fetch All Courses
      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.lectures || action.payload;
        if (action.payload.pagination) {
          state.pagination = {
            currentPage: action.payload.currentPage || 1,
            totalPages: action.payload.totalPages || 1,
            totalItems: action.payload.totalItems || action.payload.lectures?.length || 0,
          };
        }
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Course
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.list.unshift(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Course
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.list.findIndex(course => course.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentCourse?.id === action.payload.id) {
          state.currentCourse = action.payload;
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Course
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.list = state.list.filter(course => course.id !== action.payload);
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Course Status
      .addCase(updateCourseStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourseStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.list.findIndex(course => course.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentCourse?.id === action.payload.id) {
          state.currentCourse = action.payload;
        }
      })
      .addCase(updateCourseStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearCourseError,
  clearCourseSuccess,
  setCourseFilters,
  setCoursePage,
  setCurrentCourse,
  clearCurrentCourse
} = courseSlice.actions;

export default courseSlice.reducer;

// Selectors
export const selectCourses = (state) => state.courses.list;
export const selectUserCourses = (state) => state.courses.userCourses;
export const selectCurrentCourse = (state) => state.courses.currentCourse;
export const selectCoursesLoading = (state) => state.courses.loading;
export const selectCourseError = (state) => state.courses.error;
export const selectCourseSuccess = (state) => state.courses.success;
export const selectCoursePagination = (state) => state.courses.pagination;
export const selectCourseFilters = (state) => state.courses.filters;

// Export fetchAllCourses as selectAllCourses for admin pages
export const selectAllCourses = (state) => state.courses.list;
