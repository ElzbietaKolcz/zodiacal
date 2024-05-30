import { createSlice } from "@reduxjs/toolkit";

const cosmeticSlice = createSlice({
  name: "cosmetics",
  initialState: [],
  reducers: {
    getCosmetics: (state, action) => {
      return state;
    },
    setCosmeticss: (state, action) => {
      return action.payload;
    },
    addCosmetics: (state, action) => {
      state.push(action.payload);
    },
    removeCosmetics: (state, action) => {
      return state.filter(cosmetics => cosmetics.id !== action.payload);
    },
    updateCosmeticsState: (state, action) => {
      const { id, state: newState } = action.payload;
      state.cosmeticss = state.cosmeticss.map(cosmetics =>
        cosmetics.id === id ? { ...cosmetics, state: newState } : cosmetics
      );
    },
  },
});

export const { getCosmetics, setCosmeticss, addCosmetics, removeCosmetics, updateCosmeticsState } = cosmeticSlice.actions;
export default cosmeticSlice.reducer;
