'use client';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { store } from '../store/index';
import { loadUserFromStorage } from '../store/slices/authSlice';

export default function ReduxProvider({ children }) {
  useEffect(() => {
    // Load user data from localStorage on app initialization
    store.dispatch(loadUserFromStorage());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}