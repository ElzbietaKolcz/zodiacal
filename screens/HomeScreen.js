import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { View, Text, Button } from "react-native";

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>Home Screen</Text>
      <Button
        title="Horoscope"
        onPress={() => navigation.navigate("Horoscope")}
      ></Button>
    </View>
  );
};

export default HomeScreen;
