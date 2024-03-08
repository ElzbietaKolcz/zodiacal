import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider, Provider } from "react-native-paper";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import userSlice from "./src/features/userSlice";
import cosmeticSlice from "./src/features/cosmeticSlice";
import { theAstrologerApi } from "./src/helpers/theAstrologerApi";

const Stack = createNativeStackNavigator();

// firebase user data
// you should connect onAuthStateChanged() method here to manage
// the user behaviour, disseminated between multiple screens
// if you want to test how it works, run expo dev server and comment
// out one of the user instances below

// const user = undefined; // this means there is no user
const user = {}; // this means the user exists

// the ternary operator beneath, will trigger the desired navigator
// depending on the user state
//
// if there is no user, the default route will be login screen
// if there is a user, default route will be the home screen containing the tab navigator
export default function App() {
  const store = configureStore({
    reducer: {
      userSlice,
      cosmeticSlice,
      [theAstrologerApi.reducerPath]: theAstrologerApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(theAstrologerApi.middleware),
  });
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          {user ? (
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen
                options={{ headerShown: false }}
                name="Home"
                component={HomeScreen}
              />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </Stack.Navigator>
          ) : (
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen
                options={{ headerShown: false }}
                name="Home"
                component={HomeScreen}
              />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}
