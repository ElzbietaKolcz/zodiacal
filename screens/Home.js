import React, { useState } from "react";
import { Button, View, StatusBar } from "react-native";
import Header from "./Header";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import tw from "twrnc";

const Home = () => {
  const navigation = useNavigation();
  let today = new Date().toISOString().slice(0, 10)

  return (
    <View style={tw`bg-white h-full w-full  `}>
      <StatusBar backgroundColor="white" />
      <Header />
      <Button
        title="Horoscope"
        onPress={() => navigation.navigate("Horoscope")}
      />

      <Calendar
        style={{
          borderWidth: 1,
          borderColor: "gray",
          height: 350,
        }}
        current={today}
        onDayPress={(day) => {
          console.log("selected day", day);
        }}
        markedDates={{
          "2023-11-01": { selected: true, marked: true, selectedColor: "blue" },
          "2023-11-02": { marked: true },
          "2023-11-03": { selected: true, marked: true, selectedColor: "pink" },
        }}
      />
    </View>
  );
};

export default Home;
