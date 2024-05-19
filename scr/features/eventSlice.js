import { createSlice } from "@reduxjs/toolkit";

export const eventSlice = createSlice({
  name: "events",
  initialState: [],
  reducers: {
    setEvents: (state, action) => {
      return action.payload;
    },
    addEvent: (state, action) => {
      state.push(action.payload);
    },
    removeEvent: (state, action) => {
      return state.filter(event => event.id !== action.payload);
    },
  },
});

export const { setEvents, addEvent, removeEvent } = eventSlice.actions;

export default eventSlice.reducer;
