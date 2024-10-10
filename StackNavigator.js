import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Home from "./scr/screens/Home";
import Horoscope from "./scr/screens/horoscop/Horoscope";
import HoroscopeForm from "./scr/screens/horoscop/HoroscopeForm";
import SignIn from "./scr/screens/SignIn";
import SignUp from "./scr/screens/SignUp";
import YearlyCalendar from "./scr/screens/yearlyCalendar/YearlyCalendar";
import EditBirthdays from "./scr/screens/yearlyCalendar/EditBirthdays";
import SkinCare from "./scr/screens/skinCare/SkinCare";
import DayCalendar from "./scr/screens/dayCalendar/DayCalendar";
import Summary from "./scr/screens/skinCare/Summary";
import Routines from "./scr/screens/skinCare/Routines";
import Settings from "./scr/screens/Settings";

import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser } from "./scr/features/userSlice";
import { auth } from "./firebase";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function StackNavigator() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        dispatch(
          login({
            email: userAuth.email,
            uid: userAuth.uid,
            sign: "",
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
          tabBarActiveTintColor: "#7e22ce",
        }}
      >
        {user.sign === "" ? (
          <Tab.Screen
            name="Horoscope"
            component={HoroscopeForm}
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
        ) : (
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
        )}

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
            name="Settings"
            options={{ headerShown: true }}
            component={Settings}
          />

          {user.sign === "" ? (
            <Stack.Screen
              name="HoroscopeForm"
              options={{ headerShown: true }}
              component={HoroscopeForm}
            />
          ) : (
            <Stack.Screen
              name="Horoscope"
              options={{ headerShown: true }}
              component={Horoscope}
            />
          )}

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

          <Stack.Screen
            name="Summary"
            options={{ headerShown: true }}
            component={Summary}
          />

          <Stack.Screen
            name="Routines"
            options={{ headerShown: true }}
            component={Routines}
          />
        </>
      )}
    </Stack.Navigator>
  );
}