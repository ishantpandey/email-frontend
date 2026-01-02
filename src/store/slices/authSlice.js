import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    // Common reducer for both login and email verification
    setAuthData: (state, action) => {
      const { user, token } = action.payload;
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = user;
      state.token = token;
      state.error = null;
      
      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
    },

    // Authentication failure
    setAuthError: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
    },

    // Session Management
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      
      // Remove from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    },
    loadUserFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          try {
            const user = JSON.parse(userData);
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
          } catch (error) {
            // If parsing fails, clear invalid data
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
          }
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setAuthData,
  setAuthError,
  logout,
  loadUserFromStorage,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;