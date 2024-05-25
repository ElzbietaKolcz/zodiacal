import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Checkbox } from "react-native-paper";
import tw from "twrnc";
import { Agenda } from "react-native-calendars";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { currentYear, currentMonth, currentWeek } from "../../variables";

// Funkcja transformująca dane dla komponentu Agenda
const transformItemsForAgenda = (items) => {
  let transformedItems = {};
  for (const date in items) {
    const day = items[date].day; // Pobierz dzień z obiektu
    transformedItems[`${currentYear}-${currentMonth.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`] = []; // Ustaw klucz daty z pola 'day'
    for (const period in items[date]) {
      if (period === "tasks" || period === "events") {
        items[date][period].forEach((item) => {
          transformedItems[`${currentYear}-${currentMonth.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`].push({
            ...item,
            period: period,
          });
        });
      }
    }
  }
  return transformedItems;
};

const CustomAgenda = () => {
  const [transformedItems, setTransformedItems] = useState({});

  useEffect(() => {
    const fetchItemsFromFirebase = async () => {
      const userId = auth.currentUser.uid;
      const itemsFromFirebase = {};
  
      // Pobierz dane z Firebase
      const tasksQuerySnapshot = await getDocs(query(collection(db, `users/${userId}/${currentYear}/${currentMonth}/${currentWeek}/tasks&events/tasks`)));
      const eventsQuerySnapshot = await getDocs(query(collection(db, `users/${userId}/${currentYear}/${currentMonth}/${currentWeek}/tasks&events/events`)));
  
      tasksQuerySnapshot.forEach((doc) => {
        const { day, name, state, tag } = doc.data();
        const itemDate = `${currentYear}-${currentMonth.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
        if (!itemsFromFirebase[itemDate]) {
          itemsFromFirebase[itemDate] = { day: day, tasks: [], events: [] };
        }
        itemsFromFirebase[itemDate].tasks.push({ day, name, state, tag });
      });
  
      eventsQuerySnapshot.forEach((doc) => {
        const { day, name, state, tag, selectedColor} = doc.data();
        const itemDate = `${currentYear}-${currentMonth.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
        if (!itemsFromFirebase[itemDate]) {
          itemsFromFirebase[itemDate] = { day: day, tasks: [], events: [] };
        }
        itemsFromFirebase[itemDate].events.push({ day, name, state, tag, selectedColor });
      });
  
      // Przekształć dane i ustaw je w stanie
      setTransformedItems(transformItemsForAgenda(itemsFromFirebase));
    };
  
    fetchItemsFromFirebase();
  }, []);
  

  const renderItem = (item, isFirst) => {
    if (item.tag === "task" || item.tag === "event") {
  
      return (
        <TouchableOpacity style={tw`flex-row h-1/3 flex items-center text-black rounded-lg flex-1`}>
          <View style={[tw`flex-grow m-1 bg-fuchsia-200 rounded-lg p-2 mx-4 mt-2`]}>
            <Text style={[tw`text-base px-2`, item.tag === "event" && tw`text-red-700 font-semibold`]}>
              {item.name}
            </Text>
          </View>
          <View style={tw`rounded-lg mr-4`}>
            <Checkbox
              status={"unchecked"}
              uncheckedColor="#535353"
              color="#8D03A5"
            />
          </View>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };
  

  return (
    <Agenda
      items={transformedItems}
      renderItem={renderItem}
      firstDay={1}
      theme={{
        background: "purple",
        todayTextColor: "purple",
        textMonthFontWeight: "semibold",
        selectedDayBackgroundColor: "purple",
        agendaTodayColor: "purple",
        dotColor: "purple"
      }}
    />
  );
};

export default CustomAgenda;