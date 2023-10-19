import * as React from "react";
import StackNavigator from "./screens/StackNavigator";
import { NavigationContainer } from "@react-navigation/native";
import useAuth from "./hooks/useAuth";
import { AuthProvider } from "./hooks/useAuth";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator></StackNavigator>
      </AuthProvider>
    </NavigationContainer>
  );
}
