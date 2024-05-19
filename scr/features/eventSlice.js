import { createSlice } from "@reduxjs/toolkit";

export const eventSlice = createSlice({
  name: "event",
  initialState: [],
  reducers: {
    addEvent: (state, action) => {
      state.push(action.payload);
    },
    removeEvent: (state, action) => {
      return state.filter((event) => event.id !== action.payload);
    },
    setEvents: (state, action) => {
      return action.payload;
    },
  },
});

export const { addEvent, removeEvent } = eventSlice.actions;
export const setevents = (events) => ({
  type: "events/setEvent",
  payload: events,
});

export default eventSlice.reducer;
