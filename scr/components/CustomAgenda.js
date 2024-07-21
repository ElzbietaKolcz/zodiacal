import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Checkbox } from "react-native-paper";
import tw from "twrnc";
import { Agenda } from "react-native-calendars";
import { collection, query, getDocs, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { currentYear, currentMonth, currentWeek } from "../../variables";

const transformItemsForAgenda = (items) => {
  let transformedItems = {};
  for (const date in items) {
    const day = items[date].day;
    transformedItems[`${currentYear}-${currentMonth.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`] = [];
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
  const user = auth.currentUser;

  useEffect(() => {
    const fetchItemsFromFirebase = async () => {
      const userId = auth.currentUser.uid;
      const itemsFromFirebase = {};

      const tasksQuerySnapshot = await getDocs(query(collection(db, `users/${userId}/${currentYear}/${currentMonth}/weeks/${currentWeek}/tasks/`)));
      const eventsQuerySnapshot = await getDocs(query(collection(db, `users/${userId}/${currentYear}/${currentMonth}/weeks/${currentWeek}/events`)));

      tasksQuerySnapshot.forEach((doc) => {
        const { day, name, state, tag } = doc.data();
        const itemDate = `${currentYear}-${currentMonth.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
        if (!itemsFromFirebase[itemDate]) {
          itemsFromFirebase[itemDate] = { day: day, tasks: [], events: [] };
        }
        itemsFromFirebase[itemDate].tasks.push({ id: doc.id, day, name, state, tag });
      });

      eventsQuerySnapshot.forEach((doc) => {
        const { day, name, state, tag, selectedColor } = doc.data();
        const itemDate = `${currentYear}-${currentMonth.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
        if (!itemsFromFirebase[itemDate]) {
          itemsFromFirebase[itemDate] = { day: day, tasks: [], events: [] };
        }
        itemsFromFirebase[itemDate].events.push({ id: doc.id, day, name, state, tag, selectedColor });
      });

      setTransformedItems(transformItemsForAgenda(itemsFromFirebase));
    };

    fetchItemsFromFirebase();
  }, []);

  const handleCheckbox = async (itemId, currentState, itemType) => {
    try {
      const userId = auth.currentUser.uid;
      let userCollectionRef;

      if (itemType === 'tasks') {
        userCollectionRef = collection(
          db,
          `users/${userId}/${currentYear}/${currentMonth}/weeks/${currentWeek}/events/`
        );
      } else if (itemType === 'events') {
        userCollectionRef = collection(
          db,
          `users/${userId}/${currentYear}/${currentMonth}/weeks/${currentWeek}/events/`
        );
      } else {
        throw new Error('Invalid item type');
      }

      await updateDoc(doc(userCollectionRef, itemId), {
        state: !currentState
      });

      setTransformedItems(prevItems => {
        const updatedItems = { ...prevItems };
        for (const date in updatedItems) {
          if (itemType === 'tasks' && updatedItems[date].tasks) {
            updatedItems[date].tasks = updatedItems[date].tasks.map(task =>
              task.id === itemId ? { ...task, state: !currentState } : task
            );
          }
          if (itemType === 'events' && updatedItems[date].events) {
            updatedItems[date].events = updatedItems[date].events.map(event =>
              event.id === itemId ? { ...event, state: !currentState } : event
            );
          }
        }
        return updatedItems;
      });

      console.log(`Item with ID ${itemId} state updated successfully.`);
    } catch (error) {
      console.error("Error updating item state:", error.message);
    }
  };

  const renderItem = (item, index) => {
    const uniqueCheckboxId = `${item.id}-${index}`;
    return (
      <View
        style={tw`flex-row h-1/3 flex items-center text-black rounded-lg flex-1`}
        key={uniqueCheckboxId}
      >
        <View style={[
          tw`flex-grow m-1 rounded-lg p-2 mx-4 mt-2`,
          item.state ? tw`bg-fuchsia-100` : tw`bg-fuchsia-200`
        ]}>
          <Text style={[
            tw`text-base px-2`,
            item.period === "events" && tw`text-red-700 font-semibold`,
            item.state && tw` text-gray-500 line-through`,
          ]}>
            {item.name}
          </Text>
        </View>
        <View style={tw`rounded-lg mr-4`}>
          <Checkbox
            status={item.state ? "checked" : "unchecked"}
            onPress={() => handleCheckbox(item.id, item.state, item.period)}
            uncheckedColor="#535353"
            color="#8D03A5"
          />
        </View>
      </View>
    );
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
