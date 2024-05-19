import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { astrologyApi } from "./scr/services/astrologyApi";
import userReducer from "./scr/features/userSlice";
import birthdayReducer from "./scr/features/birthdaySlice";
import taskReducer from "./scr/features/taskSlice";
import goalReducer from "./scr/features/goalSlice";
import cosmeticSlice from "./scr/features/cosmeticSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    birthdays: birthdayReducer,
    task: taskReducer,
    goals: goalReducer,
    cosmetics: cosmeticSlice,
    [astrologyApi.reducerPath]: astrologyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(astrologyApi.middleware),
});
