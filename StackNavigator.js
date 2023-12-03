import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Home from "./screens/Home";
import Horoscope from "./screens/Horoscope";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import YearlyCalendar from "./screens/YearlyCalendar";
import EditBirthdays from "./screens/EditBirthdays";
import SkinCare from "./screens/SkinCare";
import DayCalendar from "./screens/DayCalendar";

import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser } from "./features/userSlice";
import { auth, onAuthStateChanged } from "./firebase";

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

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

  function HomeTabs() {
    return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarActiveTintColor: "#be185d",
        }}
      >
        <Tab.Screen
          name="Horoscope"
          component={Horoscope}
          activeColor="#be185d"
          inactiveColor="#3e2465"
          options={{
            tabBarLabel: "Horoscope",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="zodiac-aquarius"
                color={color}
                size={26}
              />
            ),
          }}
        />

        <Tab.Screen
          name="YearlyCalendar"
          component={YearlyCalendar}
          options={{
            tabBarLabel: "Year",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="calendar-month"
                color={color}
                size={26}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="home"
                color={color}
                size={26}
              />
            ),
          }}
        />

        <Tab.Screen
          name="DayCalendar"
          component={DayCalendar}
          options={{
            tabBarLabel: "Day",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="white-balance-sunny"
                color={color}
                size={26}
              />
            ),
          }}
        />

        <Tab.Screen
          name="SkinCare"
          component={SkinCare}
          options={{
            tabBarLabel: "SkinCare",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="face-woman"
                color={color}
                size={26}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

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
          name="HomeTabs"
          options={{ headerShown: false }}
          component={HomeTabs}
        />
          <Stack.Screen
            name="Horoscope"
            options={{ headerShown: true }}
            component={HomeTabs}
          />

          <Stack.Screen
            name="YearlyCalendar"
            options={{ headerShown: true }}
            component={HomeTabs}
          />

          <Stack.Screen
            name="EditBirthdays"
            options={{ headerShown: true }}
            component={EditBirthdays}
          />

          <Stack.Screen
            name="SkinCare"
            options={{ headerShown: true }}
            component={HomeTabs}
          />
          <Stack.Screen
            name="DayCalendar"
            options={{ headerShown: true }}
            component={HomeTabs}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
