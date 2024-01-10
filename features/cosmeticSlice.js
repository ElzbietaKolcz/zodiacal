import { createSlice } from '@reduxjs/toolkit';
import { data, error } from '../firebase';

const cosmeticSlice = createSlice({
  name: 'cosmetics',
  initialState: data,
  reducers: {
    getCosmetics: (state) => {
      if (!error) {
        return state;
      }
    }
  },
});

export const { getCosmetics } = cosmeticSlice.actions;
export default cosmeticSlice.reducer;
