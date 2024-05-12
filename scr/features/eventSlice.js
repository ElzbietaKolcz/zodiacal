import { createSlice } from "@reduxjs/toolkit";

const eventSlice = createSlice({
  name: "event",
  initialState: [],
  reducers: {
    addEvent: (state, action) => {
      state.push(action.payload);
    },
    removeEvent: (state, action) => {
      return state.filter(task => task.id !== action.payload);
    },
    setEvent: (state, action) => {
      return [...action.payload];
    },
  },
});

export const { addEvent, removeEvent, setEvent } = eventSlice.actions;
export default eventSlice.reducer;
