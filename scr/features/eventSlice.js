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
    updateEventState: (state, action) => {
      const { id, state: newState } = action.payload;
      state.tasks = state.tasks.map(task =>
        task.id === id ? { ...task, state: newState } : task
      );
    },
  },
});

export const { setEvents, addEvent, removeEvent, updateEventState} = eventSlice.actions;

export default eventSlice.reducer;
