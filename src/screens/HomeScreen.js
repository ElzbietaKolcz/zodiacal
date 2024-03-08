import { Text, View } from "react-native";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import HoroscopeScreen from "./HoroscopeScreen";

const HomeScreenElements = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
    </View>
  );
};
export default function HomeScreen() {
  const Tab = createMaterialBottomTabNavigator();
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeScreenElements} />
      <Tab.Screen
        options={{ headerShown: false }}
        name="Horoscope"
        component={HoroscopeScreen}
      />
    </Tab.Navigator>
  );
}
