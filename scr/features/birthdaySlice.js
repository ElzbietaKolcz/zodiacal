import { createSlice } from '@reduxjs/toolkit';

const birthdaySlice = createSlice({
  name: 'birthdays',
  initialState: [],
  reducers: {
    setBirthdays: (state, action) => {
      return action.payload;
    },
    addBirthday: (state, action) => [...state, action.payload],
    removeBirthday: (state, action) => {
      return state.filter(birthday => birthday.id !== action.payload);
    },
  },
});

export const { setBirthdays, addBirthday, removeBirthday } = birthdaySlice.actions;
export default birthdaySlice.reducer;
