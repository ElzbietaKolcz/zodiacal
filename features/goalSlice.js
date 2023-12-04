import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  goals: [],
  goalAdded: false,
};

const goalSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    setGoals: (state, action) => {
      state.goals = action.payload;
      state.goalAdded = false;
    },
    addGoal: (state, action) => {
      state.goals.push(action.payload);
      state.goalAdded = true;
    },
    updateGoal: (state, action) => {
      const { index, name } = action.payload;
      state.goals[index].name = name;
      state.goalAdded = true;
    },
    toggleGoalState: (state, action) => {
      const index = action.payload;

      state.goals[index].state = !state.goals[index].state;
      state.goalAdded = true;
    },
    removeGoal: (state, action) => {
      const goalIdToRemove = action.payload;
      state.goals = state.goals.filter((goal) => goal.id !== goalIdToRemove);
      state.goalAdded = false;
    },
  },
});

export const {
  setGoals,
  addGoal,
  updateGoal,
  resetGoalAdded,
  removeGoal,
  toggleGoalState,
} = goalSlice.actions;

export const selectGoals = (state) => state.goals.goals;
export const selectGoalAdded = (state) => state.goals.goalAdded;

export default goalSlice.reducer;
