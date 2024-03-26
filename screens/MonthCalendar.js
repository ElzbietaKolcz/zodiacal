import React from "react";
import { View, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import tw from "twrnc";

const MonthCalendar = ({ currentYear, month, userBirthdays }) => {

  const markedDates = generateMarkedDates(userBirthdays, currentYear, month);

  function generateMarkedDates(userBirthdays, currentYear) {
    const markedDates = {};

    userBirthdays.forEach((birthday, index) => {
      const formattedDay = birthday.day.toString().padStart(2, "0");
      const formattedMonth = birthday.month.toString().padStart(2, "0");
      const dateKey = `${currentYear}-${formattedMonth}-${formattedDay}`;

      markedDates[dateKey] = {
        selected: true,
        selectedColor: "purple",
      };
    });

    return markedDates;
  }
  // console.log("markedDates:", markedDates);

  return (
    <View style={tw`w-full`}>
      <Calendar
        style={tw`border-4 rounded border-fuchsia-100`}
        current={`${currentYear}-${month.toString().padStart(2, "0")}-01`}
        markedDates={markedDates}
        hideExtraDays={true}
        firstDay={1}
        hideArrows={true}
        theme={{
          todayTextColor: "purple",
          textMonthFontWeight: "semibold",
        }}
      />
      <View style={tw`my-4 flex-row flex-wrap`}>
        {userBirthdays.map((birthday, index) => {
          if (birthday.month === month) {
            const formattedDay =
              birthday.day < 10 ? `0${birthday.day}` : birthday.day;
            return (
              <Text
                variant="bodyLarge"
                style={tw`ml-7 text-black`}
                key={`${birthday.id}-${index}`}
              >
                {formattedDay} {birthday.name}
              </Text>
            );
          }
          return null;
        })}
      </View>
    </View>
  );
};

export default MonthCalendar;
