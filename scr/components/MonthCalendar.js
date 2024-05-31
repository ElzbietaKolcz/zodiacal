import React from "react";
import { View, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import tw from "twrnc";

const MonthCalendar = ({
  currentYear,
  month,
  userBirthdays,
  userEvents,
  userHolidays,
}) => {
  const markedDates = generateMarkedDates(
    userBirthdays,
    userEvents,
    userHolidays,
    currentYear,
    month,
  );

  function generateMarkedDates(
    userBirthdays,
    userEvents,
    userHolidays,
    currentYear,
    month,
  ) {
    const markedDates = {};

    userBirthdays.forEach((birthday) => {
      const formattedDay =
        birthday.day < 10
          ? `0${birthday.day}`
          : birthday.day.toString().padStart(2, "0");
      const formattedMonth = birthday.month.toString().padStart(2, "0");
      const dateKey = `${currentYear}-${formattedMonth}-${formattedDay}`;

      markedDates[dateKey] = {
        selected: true,
        selectedColor: "#701a75",
      };
    });

    if (userEvents) {
      userEvents.forEach((event) => {
        const formattedDay =
          event.day < 10
            ? `0${event.day}`
            : event.day.toString().padStart(2, "0");
        const formattedMonth = event.month.toString().padStart(2, "0");
        const dateKey = `${currentYear}-${formattedMonth}-${formattedDay}`;

        markedDates[dateKey] = {
          selected: true,
          selectedColor: "#e11d48",
        };
      });
    }

    if (userHolidays) {
      userHolidays.forEach((holiday) => {
        const formattedDay =
          holiday.day < 10
            ? `0${holiday.day}`
            : holiday.day.toString().padStart(2, "0");
        const formattedMonth = holiday.month.toString().padStart(2, "0");
        const dateKey = `${currentYear}-${formattedMonth}-${formattedDay}`;

        markedDates[dateKey] = {
          selected: true,
          selectedColor: "#f59e0b",
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
        {userBirthdays.map((birthday) => {
          if (birthday.month === month) {
            return (
              <Text
                variant="bodyLarge"
                style={tw`ml-7 text-[#4a044e] font-semibold`}
                key={`${birthday.id}`}
              >
                {birthday.day} {birthday.name}
              </Text>
            );
          }
          return null;
        })}

        {userEvents &&
          userEvents.map((event) => {
            if (event.month === month) {
              return (
                <Text
                  variant="bodyLarge"
                  style={tw`ml-7 text-[#e11d48] font-semibold`}
                  key={`${event.id}`}
                >
                  {event.day} {event.name}
                </Text>
              );
            }
            return null;
          })}

        {userHolidays &&
          userHolidays.map((holiday) => {
            if (holiday.month === month) {
              return (
                <Text
                  variant="bodyLarge"
                  style={tw`ml-7 text-[#f59e0b] font-semibold`}
                  key={`${holiday.id}`}
                >
                  {holiday.day} {holiday.name}
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
