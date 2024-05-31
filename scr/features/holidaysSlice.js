import { createSlice } from "@reduxjs/toolkit";

const holidaysSlice = createSlice({
  name: "holidays",
  initialState: [],
  reducers: {
    setHolidays: (state, action) => action.payload,
    clearHolidays: () => [],
  },
});

export const { setHolidays, clearHolidays } = holidaysSlice.actions;
export default holidaysSlice.reducer;
