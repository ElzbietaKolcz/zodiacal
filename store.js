import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { astrologyApi } from "./services/astrologyApi";
import userReducer from "./features/userSlice";
import birthdayReducer  from './features/birthdaySlice';
import taskReducer from "./features/taskSlice";
import goalReducer from "./features/goalSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    birthdays: birthdayReducer,
    task: taskReducer,
    goals: goalReducer,
    
    [astrologyApi.reducerPath]: astrologyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(astrologyApi.middleware),
});
