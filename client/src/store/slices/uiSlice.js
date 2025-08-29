import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Global loading state
  isLoading: false,
  
  // Toast notifications
  notifications: [],
  
  // Modal management
  activeModal: null,
  modalData: null,
  
  // Sidebar & navigation
  sidebarOpen: false,
  
  // Theme settings (if you implement dark/light mode)
  theme: 'light',
  
  // Global error state
  error: null
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    // Notifications
    addNotification: (state, action) => {
      // Add a new notification with a unique ID
      const notification = {
        id: Date.now(),
        ...action.payload
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Modal management
    openModal: (state, action) => {
      state.activeModal = action.payload.modalType;
      state.modalData = action.payload.modalData || null;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalData = null;
    },
    
    // Sidebar toggle
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarState: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    
    // Theme toggle
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    
    // Error handling
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

// Export actions
export const {
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  toggleSidebar,
  setSidebarState,
  toggleTheme,
  setTheme,
  setError,
  clearError
} = uiSlice.actions;

// Export selectors
export const selectIsLoading = (state) => state.ui.isLoading;
export const selectNotifications = (state) => state.ui.notifications;
export const selectActiveModal = (state) => state.ui.activeModal;
export const selectModalData = (state) => state.ui.modalData;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectTheme = (state) => state.ui.theme;
export const selectError = (state) => state.ui.error;

// Export reducer
export default uiSlice.reducer;