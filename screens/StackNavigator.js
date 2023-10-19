import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "./SignIn";
import HomeScreen from "./HomeScreen";
import Horoscope from "./Horoscope";
import SignUp from "./SignUp";
import useAuth from "../hooks/useAuth";

const Stack = createNativeStackNavigator();

export default function app() {
  const { user } = useAuth();
  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen
            name="Home"
            options={{ headerShown: false }}
            component={HomeScreen}
          />
          <Stack.Screen
            name="Horoscope"
            options={{ headerShown: true }}
            component={Horoscope}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="SignIn"
            options={{ headerShown: false }}
            component={SignIn}
          />

          <Stack.Screen
            name="SignUp"
            options={{ headerShown: false }}
            component={SignUp}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
