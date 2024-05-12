import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity,  } from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { currentYear, currentMonth, currentDay } from "../../variables";
import { Agenda } from "react-native-calendars";
import {  Text, Button } from "react-native-paper";

const SkinCare = () => {
  const navigation = useNavigation();
  return (
    <ScrollView style={tw` bg-white h-full w-full`}>
      <View style={tw`flex-row justify-between w-full`}>
        <Button
        style={tw`py-2 px-6 mt-1`}
         mode ="text"
         textColor = "black"
         labelStyle = {tw`font-bold text-black text-base`}
          title="Summary"
          onPress={() => navigation.navigate("Summary")}
        >Summary</Button>
        <Text  variant="titleMedium"
        style={tw`p-5 text-fuchsia-700 font-bold`}> SkinCare </Text> 

        <Button
        style={tw`py-2 px-6 mt-1`}
        mode ="text"
        textColor = "black"
        labelStyle = {tw`font-bold text-black text-base`}
          title="Routines"
          onPress={() => navigation.navigate("Routines")}
        >Routines</Button>
      </View>
      
      <Agenda
        current={`${currentYear}-${currentMonth
          .toString()
          .padStart(2, "0")}-${currentDay.toString().padStart(2, "0")}`}
        firstDay={1}
        items={{
           
        }}
        renderItem={(item, isFirst) => (
          <TouchableOpacity
            style={tw`bg-fuchsia-50 text-black rounded-lg m-5 flex-1 rounded-lg p-5 mr-4 mt-4`}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
        theme={{
          todayTextColor: "purple",
          textMonthFontWeight: "semibold",
          selectedDayBackgroundColor: "purple",
          agendaTodayColor: "purple",
        }}
      />
    </ScrollView>
  );
};

export default SkinCare;
