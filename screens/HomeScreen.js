import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { Button } from "react-native";
import { useState } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { useSelector } from "react-redux";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState("");
  const clickCounterSelector = useSelector((state) => state.test);
  console.log(clickCounterSelector, "info ze strony głównej");

  return (
    <>
      <Button
        title="Horoscope"
        onPress={() => navigation.navigate("Horoscope")}
      />
      <Calendar
        // Customize the appearance of the calendar
        style={{
          borderWidth: 1,
          borderColor: "gray",
          height: 350,
        }}
        // Specify the current date
        current={"2012-03-01"}
        // Callback that gets called when the user selects a day
        onDayPress={(day) => {
          console.log("selected day", day);
        }}
        // Mark specific dates as marked
        markedDates={{
          "2012-03-01": { selected: true, marked: true, selectedColor: "blue" },
          "2012-03-02": { marked: true },
          "2012-03-03": { selected: true, marked: true, selectedColor: "blue" },
        }}
      />
    </>
  );
};

export default HomeScreen;
