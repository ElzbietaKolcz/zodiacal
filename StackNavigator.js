import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Home from "./scr/screens/Home";
import Horoscope from "./scr/screens/Horoscope";
import SignIn from "./scr/screens/SignIn";
import SignUp from "./scr/screens/SignUp";
import YearlyCalendar from "./scr/screens/YearlyCalendar";
import EditBirthdays from "./scr/screens/EditBirthdays";
import SkinCare from "./scr/screens/SkinCare";
import DayCalendar from "./scr/screens/DayCalendar";

import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser } from "./scr/features/userSlice";
import { auth } from "./firebase";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function StackNavigator() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(userAuth => {
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

    return unsubscribe;
  }, [dispatch]);

  function HomeTabs({ navigation, route }) {
    useEffect(() => {
      if (route.params?.initialScreen) {
        navigation.navigate("Home");
      }
    }, [route.params?.initialScreen, navigation]);

    return (
      <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#7e22ce',
      }}>
        <Tab.Screen
          name="Horoscope"
          component={Horoscope}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="zodiac-aquarius"
                color={color}
                size={size}
              />
            ),
            headerShown: false,
          }}
        />

        <Tab.Screen
          name="YearlyCalendar"
          component={YearlyCalendar}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="calendar-month"
                color={color}
                size={size}
              />
            ),
            headerShown: false,
          }}
        />

        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="home"
                color={color}
                size={size}
              />
            ),
            headerShown: false,
          }}
        />

        <Tab.Screen
          name="DayCalendar"
          component={DayCalendar}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="white-balance-sunny"
                color={color}
                size={size}
              />
            ),
            headerShown: false,
          }}
        />

        <Tab.Screen
          name="SkinCare"
          component={SkinCare}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="face-woman"
                color={color}
                size={size}
              />
            ),
            headerShown: false,
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
            initialParams={{ initialScreen: true }}
            component={HomeTabs}
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

          <Stack.Screen
            name="EditBirthdays"
            options={{ headerShown: true }}
            component={EditBirthdays}
          />

          <Stack.Screen
            name="SkinCare"
            options={{ headerShown: true }}
            component={SkinCare}
          />

          <Stack.Screen
            name="DayCalendar"
            options={{ headerShown: true }}
            component={DayCalendar}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
