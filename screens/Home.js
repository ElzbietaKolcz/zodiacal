import React, { useState } from "react";
import { Button, View } from "react-native";
import Header from "./Header";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import tw from "twrnc";

const Home = () => {
  const navigation = useNavigation();

  return (
    <View style={tw`bg-white h-full w-full mt-10 `}>
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
        current={"2012-03-01"}
        onDayPress={(day) => {
          console.log("selected day", day);
        }}
        markedDates={{
          "2012-03-01": { selected: true, marked: true, selectedColor: "blue" },
          "2012-03-02": { marked: true },
          "2012-03-03": { selected: true, marked: true, selectedColor: "blue" },
        }}
      />
    </View>
  );
};

export default Home;
