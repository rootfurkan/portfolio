import { createSlice } from '@reduxjs/toolkit';

// Sayfa yenilenince login olmuş kalsın
const savedToken = localStorage.getItem('token');
const savedUser = localStorage.getItem('user');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: savedToken || null,
    user: savedUser ? JSON.parse(savedUser) : null,
    isAuthenticated: !!savedToken   // token varsa true
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      // localStorage'a kaydet
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;