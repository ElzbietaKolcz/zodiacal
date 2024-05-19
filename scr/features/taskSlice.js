import { createSlice } from "@reduxjs/toolkit";

export const taskSlice = createSlice({
  name: "tasks",
  initialState: [],
  reducers: {
    setTasks: (state, action) => {
      return action.payload;
    },
    addTask: (state, action) => {
      state.push(action.payload);
    },
    removeTask: (state, action) => {
      return state.filter(task => task.id !== action.payload);
    },
  },
});

export const { setTasks, addTask, removeTask } = taskSlice.actions;

export default taskSlice.reducer;
