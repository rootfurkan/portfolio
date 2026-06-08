import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';

const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    profile: profileReducer
  }
});

export default store;