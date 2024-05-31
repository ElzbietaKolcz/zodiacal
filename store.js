import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { astrologyApi } from "./scr/services/astrologyApi";
import userReducer from "./scr/features/userSlice";
import birthdayReducer from "./scr/features/birthdaySlice";
import taskReducer from "./scr/features/taskSlice";
import goalReducer from "./scr/features/goalSlice";
import cosmeticReducer from "./scr/features/cosmeticSlice";
import holidaysReducer from "./scr/features/holidaysSlice";
import eventReducer from "./scr/features/eventSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    birthdays: birthdayReducer,
    task: taskReducer,
    event: eventReducer,
    goals: goalReducer,
    cosmetics: cosmeticReducer,
    holidays: holidaysReducer,
    [astrologyApi.reducerPath]: astrologyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(astrologyApi.middleware),
});
