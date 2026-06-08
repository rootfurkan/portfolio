import { createSlice } from '@reduxjs/toolkit';

// localStorage'dan tema tercihi oku (sayfa yenilenince kaybolmasın)
const savedTheme = localStorage.getItem('theme') || 'dark';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: savedTheme   // 'light' veya 'dark'
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', state.mode);
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem('theme', state.mode);
    }
  }
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;