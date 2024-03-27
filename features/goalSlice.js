import { createSlice } from '@reduxjs/toolkit';

const goalSlice = createSlice({
  name: 'goals',
  initialState: [],
  reducers: {
    setGoals: (state, action) => {
      return action.payload;
    },
    addGoal: (state, action) => [...state, action.payload],
    updateGoal: (state, action) => {
      const { index, name } = action.payload;
      return state.map(goal => {
        if (goal.index === index) {
          return { ...goal, name };
        }
        return goal;
      });
    },
    toggleGoalState: (state, action) => {
      const index = action.payload;
      return state.map(goal => {
        if (goal.index === index) {
          return { ...goal, state: !goal.state };
        }
        return goal;
      });
    },
  },
});

export const { setGoals, addGoal, updateGoal, toggleGoalState } = goalSlice.actions;
export const selectGoals = state => state.goals;
export const selectGoalAdded = state => state.goalAdded; 
export default goalSlice.reducer;