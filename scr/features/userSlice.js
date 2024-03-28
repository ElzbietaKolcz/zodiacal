import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    updateSign: (state, action) => {
      state.user.sign = action.payload;
    },
  },
});

export const setInitialUserSign = (sign) => (dispatch) => {
  dispatch(updateSign(sign));
};

export const { logout, updateSign } = userSlice.actions;

export const login = (userData) => {
  console.log("Przekazywane dane użytkownika:", userData);
  return {
    type: "user/login",
    payload: userData,
  };
};

export const selectUser = (state) => state.user.user;

export const selectUserSign = (state) => state.user.user.sign;

export default userSlice.reducer;
