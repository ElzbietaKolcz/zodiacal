import userReducer from "./features/userSlice";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { astrologyApi } from "./services/astrologyApi";
import birthdayReducer  from './features/birthdaySlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    birthdays: birthdayReducer,
    [astrologyApi.reducerPath]: astrologyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(astrologyApi.middleware),
});
