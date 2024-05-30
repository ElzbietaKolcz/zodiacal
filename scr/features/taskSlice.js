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
    updateTaskState: (state, action) => {
      const { id, state: newState } = action.payload;
      state.tasks = state.tasks.map(task =>
        task.id === id ? { ...task, state: newState } : task
      );
    },
  },
});

export const { setTasks, addTask, removeTask, updateTaskState } = taskSlice.actions;

export default taskSlice.reducer;
