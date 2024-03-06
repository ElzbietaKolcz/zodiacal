import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
const Tab = createBottomTabNavigator();

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
