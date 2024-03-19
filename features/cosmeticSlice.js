import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  error: null
};

const cosmeticSlice = createSlice({
  name: 'cosmetics',
  initialState,
  reducers: {
    getCosmetics: (state, action) => {
      return state;
    }
  },
});

export const { getCosmetics } = cosmeticSlice.actions;
export default cosmeticSlice.reducer;
