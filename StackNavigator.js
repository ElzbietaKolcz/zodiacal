import React, { useEffect } from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./screens/Home";
import Horoscope from "./screens/Horoscope";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import YearlyCalendar from "./screens/YearlyCalendar"

import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser } from "./features/userSlice";
import { auth, onAuthStateChanged } from "./firebase";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        dispatch(
          login({
            email: userAuth.email,
            uid: userAuth.uid,
          }),
        );
      } else {
        dispatch(logout());
      }
    });
  }, []);

  return (
    <Stack.Navigator>
      {!user ? (
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
      ) : (
        <>
          <Stack.Screen
            name="Home"
            options={{ headerShown: false }}
            component={Home}
          />
          <Stack.Screen
            name="Horoscope"
            options={{ headerShown: true }}
            component={Horoscope}
          />

<Stack.Screen
            name="YearlyCalendar"
            options={{ headerShown: true }}
            component={YearlyCalendar}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
