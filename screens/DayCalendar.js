import React from "react";
import { View, Text } from "react-native";

const DayCalendar = () => {
  return (
    <View style={tw`flex-1 bg-white justify-center items-center`}>
      <Text style={tw`text-center text-xl font-semibold `}>Current week</Text>
    </View>
  );
};

export default DayCalendar;
