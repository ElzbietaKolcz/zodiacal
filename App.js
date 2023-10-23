import * as React from "react";
import StackNavigator from "./screens/StackNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./hooks/useAuth";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { astrologyApi } from "./services/astrologyApi";
import { setupListeners } from "@reduxjs/toolkit/query/react";

export default function App() {
  const store = configureStore({
    reducer: {
      [astrologyApi.reducerPath]: astrologyApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(astrologyApi.middleware),
  });

  setupListeners(store.dispatch);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <AuthProvider>
          <StackNavigator></StackNavigator>
        </AuthProvider>
      </NavigationContainer>
    </Provider>
  );
}
