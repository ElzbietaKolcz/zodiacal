import { createSlice } from "@reduxjs/toolkit";

const goalsWeekSlice = createSlice({
  name: "goalsWeek",
  initialState: [],
  reducers: {
    setGoalsWeek: (state, action) => {
      return action.payload;
    },
    addGoalWeek: (state, action) => [...state, action.payload],
    updateGoalWeek: (state, action) => {
      const { index, name } = action.payload;
      return state.map((goal) => {
        if (goal.index === index) {
          return { ...goal, name };
        }
        return goal;
      });
    },
    toggleGoalWeekState: (state, action) => {
      const index = action.payload;
      return state.map((goal) => {
        if (goal.index === index) {
          return { ...goal, state: !goal.state };
        }
        return goal;
      });
    },
  },
});

export const {
  setGoalsWeek,
  addGoalWeek,
  updateGoalWeek,
  toggleGoalWeekState,
} = goalsWeekSlice.actions;
export const selectGoalsWeek = (state) => state.goalsWeek;
export const selectGoalWeekAdded = (state) => state.goalWeekAdded;
export default goalsWeekSlice.reducer;
