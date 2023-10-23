import userReducer from "./features/userSlice";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { astrologyApi } from "./services/astrologyApi";

export const store = configureStore({
  reducer: {
    user: userReducer,
    [astrologyApi.reducerPath]: astrologyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(astrologyApi.middleware),
});
