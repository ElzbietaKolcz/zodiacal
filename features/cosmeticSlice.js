import { createSlice } from '@reduxjs/toolkit';

// Define a default initial state
const initialState = {
  data: [],
  error: null
};

const cosmeticSlice = createSlice({
  name: 'cosmetics',
  initialState,
  reducers: {
    getCosmetics: (state, action) => {
      // You can access action.payload here if needed
      // For now, it seems you're not using it
      return state;
    }
  },
});

export const { getCosmetics } = cosmeticSlice.actions;
export default cosmeticSlice.reducer;
