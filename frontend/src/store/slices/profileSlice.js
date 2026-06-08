import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// createAsyncThunk = async işlemleri Redux'a entegre eder
// API'den profil çek
export const fetchProfile = createAsyncThunk(
  'profile/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/profile`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Hata');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    loading: false,
    error: null
  },
  reducers: {
    // Profil güncellenince store'u da güncelle
    updateProfileData: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    }
  },
  // Async thunk'ların durumlarını handle et
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { updateProfileData } = profileSlice.actions;
export default profileSlice.reducer;