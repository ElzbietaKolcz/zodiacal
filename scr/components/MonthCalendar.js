import React from "react";
import { View, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import tw from "twrnc";

const MonthCalendar = ({ currentYear, month, userBirthdays, userEvents }) => {
  const markedDates = generateMarkedDates(userBirthdays, userEvents, currentYear, month);

  function generateMarkedDates(userBirthdays, userEvents, currentYear, month) {
    const markedDates = {};

    // Dodajemy oznaczenia dla urodzin
    userBirthdays.forEach((birthday) => {
      const formattedDay = birthday.day < 10 ? `0${birthday.day}` : birthday.day.toString().padStart(2, "0");
      const formattedMonth = birthday.month.toString().padStart(2, "0");
      const dateKey = `${currentYear}-${formattedMonth}-${formattedDay}`;

      markedDates[dateKey] = {
        selected: true,
        selectedColor: "purple",
      };
    });

    // Sprawdzamy, czy userEvents istnieje
    if (userEvents) {
      // Dodajemy oznaczenia dla wydarzeń
      userEvents.forEach((event) => {
        const formattedDay = event.day < 10 ? `0${event.day}` : event.day.toString().padStart(2, "0");
        const formattedMonth = event.month.toString().padStart(2, "0");
        const dateKey = `${currentYear}-${formattedMonth}-${formattedDay}`;

        markedDates[dateKey] = {
          selected: true,
          selectedColor: "red",
        };
      });
    }

    return markedDates;
  }

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
        {/* Wyświetlamy urodziny */}
        {userBirthdays.map((birthday) => {
          if (birthday.month === month) {
            return (
              <Text
                variant="bodyLarge"
                style={tw`ml-7 text-black`}
                key={`${birthday.id}`}
              >
                {birthday.day} {birthday.name}
              </Text>
            );
          }
          return null;
        })}
        {/* Wyświetlamy wydarzenia */}
        {userEvents && userEvents.map((event) => {
          if (event.month === month) {
            return (
              <Text
                variant="bodyLarge"
                style={tw`ml-7 text-black`}
                key={`${event.id}`}
              >
                {event.day} {event.name}
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
