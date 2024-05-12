import { createSlice } from "@reduxjs/toolkit";

export const taskSlice = createSlice({
  name: "tasks",
  initialState: [],
  reducers: {
    addTask: (state, action) => {
      state.push(action.payload);
    },
    removeTask: (state, action) => {
      return state.filter(task => task.id !== action.payload);
    },
    setTasks: (state, action) => {
      return action.payload; // Update the state directly with the payload
    },
  },
});

export const { addTask, removeTask,  } = taskSlice.actions;
export const setTasks = (tasks) => ({
  type: 'tasks/setTasks',
  payload: tasks
});

export default taskSlice.reducer;
