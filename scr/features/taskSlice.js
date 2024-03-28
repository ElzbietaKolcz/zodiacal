import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "task",
  initialState: [],
  reducers: {
    setTask: (state, action) => {
      return action.payload;
    },
    addTask: (state, action) => [...state, action.payload],
    removeTask: (state, action) => {
      return state.filter((task) => task.id !== action.payload);
    },
  },
});

export const { setTask, addTask, removeTask } = taskSlice.actions;
export default taskSlice.reducer;
