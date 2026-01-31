import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  emails: [],
  selectedEmailId: null,
  loading: false,
  error: null,
};

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    // Set emails data
    setEmails: (state, action) => {
      state.emails = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Select email
    setSelectedEmail: (state, action) => {
      state.selectedEmailId = action.payload;
    },

    // Clear emails
    clearEmails: (state) => {
      state.emails = [];
      state.selectedEmailId = null;
      state.error = null;
    },

    // Add new email (for compose functionality)
    addEmail: (state, action) => {
      state.emails.unshift(action.payload);
    },

    // Update email (for actions like mark as read, star, etc.)
    updateEmail: (state, action) => {
      const { id, updates } = action.payload;
      const emailIndex = state.emails.findIndex(email => email._id === id);
      if (emailIndex !== -1) {
        state.emails[emailIndex] = { ...state.emails[emailIndex], ...updates };
      }
    },

    // Delete email
    deleteEmail: (state, action) => {
      const emailId = action.payload;
      state.emails = state.emails.filter(email => email._id !== emailId);
      if (state.selectedEmailId === emailId) {
        state.selectedEmailId = null;
      }
    },
  },
});

export const {
  setLoading,
  setEmails,
  setError,
  setSelectedEmail,
  clearEmails,
  addEmail,
  updateEmail,
  deleteEmail,
} = emailSlice.actions;

export default emailSlice.reducer;