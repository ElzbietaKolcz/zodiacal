import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "./screens/SignIn";
import HomeScreen from "./screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="SignIn"
          options={{ headerShown: false }}
          component={SignIn}
        />
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
          component={HomeScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
