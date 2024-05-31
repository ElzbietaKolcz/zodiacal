import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Checkbox } from "react-native-paper";
import tw from "twrnc";
import { Agenda } from "react-native-calendars";
import MenuRoutines from "../../components/skinCare/MenuRoutines";
import { collection, query, getDocs, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../../firebase";
import { currentYear, currentMonth, currentDay } from "../../../variables";

const transformItemsForAgenda = (items, selectedSubcategory) => {
  let transformedItems = {};
  for (const date in items) {
    transformedItems[date] = [];
    for (const period in items[date]) {
      if (period === "morning" || period === "evening") {
        transformedItems[date].push({
          period: period,
          isCategory: true,
        });
        if (period === "evening") {
          if (selectedSubcategory && items[date][period][selectedSubcategory]) {
            items[date][period][selectedSubcategory].forEach((item) => {
              transformedItems[date].push({
                ...item,
                period: period,
                subcategory: selectedSubcategory,
              });
            });
          }
        } else {
          items[date][period].forEach((item) => {
            transformedItems[date].push({
              ...item,
              period: period,
            });
          });
        }
      }
    }
  }
  return transformedItems;
};

const SkinCareAgenda = () => {
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [transformedItems, setTransformedItems] = useState({});
  const user = auth.currentUser;

  useEffect(() => {
    const fetchItemsFromFirebase = async (selectedCategory) => {
      const userId = auth.currentUser.uid;
      const itemsFromFirebase = {};

      const categoryPath = selectedCategory
        ? selectedCategory.toLowerCase()
        : "skincare";
      const eveningCategoryPath = selectedCategory
        ? `evening/${currentMonth}/${selectedCategory.toLowerCase()}`
        : "evening";

      // Fetch morning skincare items
      const morningQuerySnapshot = await getDocs(
        query(
          collection(db, `users/${userId}/${currentYear}/skincare/morning`),
        ),
      );
      morningQuerySnapshot.forEach((doc) => {
        const { product_name, brand, expiration_date, tag, state } = doc.data();
        const day = currentDay;
        const itemDate = `${currentYear}-${currentMonth
          .toString()
          .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
        if (!itemsFromFirebase[itemDate]) {
          itemsFromFirebase[itemDate] = {
            day: day,
            morning: [],
            evening: {
              moisturizing: [],
              exfoliation: [],
              reconstruction: [],
              break: [],
            },
          };
        }
        itemsFromFirebase[itemDate].morning.push({
          id: doc.id,
          name: product_name,
          state: state,
          tag,
          brand,
          expiration_date,
        });
      });

      console.log("Morning skincare items:", itemsFromFirebase);
      const eveningQuerySnapshot = await getDocs(
        query(
          collection(
            db,
            `users/${userId}/${currentYear}/skincare/${eveningCategoryPath}`,
          ),
        ),
      );
      eveningQuerySnapshot.forEach((doc) => {
        const { product_name, brand, expiration_date, tag, state } = doc.data();
        const day = currentDay;
        const itemDate = `${currentYear}-${currentMonth
          .toString()
          .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
        if (!itemsFromFirebase[itemDate]) {
          itemsFromFirebase[itemDate] = {
            day: day,
            morning: [],
            evening: {
              moisturizing: [],
              exfoliation: [],
              reconstruction: [],
              break: [],
            },
          };
        }
        itemsFromFirebase[itemDate].evening[selectedCategory].push({
          id: doc.id,
          name: product_name,
          state: state, // Added state
          tag,
          brand,
          expiration_date,
        });
      });

      setTransformedItems(
        transformItemsForAgenda(itemsFromFirebase, selectedSubcategory),
      );
    };

    fetchItemsFromFirebase(selectedSubcategory);
  }, [selectedSubcategory]);

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const handleCheckbox = async (itemId, currentState, itemType) => {
    try {
      const userId = auth.currentUser.uid;
      let userCollectionRef;

      if (itemType === "morning") {
        userCollectionRef = collection(
          db,
          `users/${userId}/${currentYear}/skincare/morning`,
        );
      } else if (itemType === "evening") {
        const categoryPath = selectedSubcategory
          ? `evening/${currentMonth}/${selectedSubcategory.toLowerCase()}`
          : "evening";
        userCollectionRef = collection(
          db,
          `users/${userId}/${currentYear}/skincare/${categoryPath}`,
        );
      } else {
        throw new Error("Invalid item type");
      }

      await updateDoc(doc(userCollectionRef, itemId), {
        state: !currentState,
      });

      setTransformedItems((prevItems) => {
        const updatedItems = { ...prevItems };
        for (const date in updatedItems) {
          updatedItems[date] = updatedItems[date].map((item) =>
            item.id === itemId ? { ...item, state: !currentState } : item,
          );
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
    if (item.isCategory) {
      return (
        <View style={tw`flex-grow flex-row justify-between flex items-start`}>
          <Text style={tw`text-lg font-bold mx-2 mt-3 p-2`}>
            {item.period.charAt(0).toUpperCase() + item.period.slice(1)}
          </Text>

          {item.period === "evening" && !selectedSubcategory && (
            <MenuRoutines onSelectSubcategory={handleSubcategorySelect} />
          )}
        </View>
      );
    }

    return (
      <View
        style={tw`flex-row h-1/3 flex items-center text-black rounded-lg flex-1`}
        key={uniqueCheckboxId}
      >
        <View
          style={[
            tw`flex-grow m-1 rounded-lg p-2 mx-4 mt-2`,
            item.state ? tw`bg-fuchsia-100` : tw`bg-fuchsia-200`,
          ]}
        >
          <Text
            style={[
              tw`text-base px-2`,
              item.state && tw` text-gray-500 line-through`,
            ]}
          >
            {item.name}
          </Text>
          <View
            style={tw`flex-grow flex-row justify-between flex items-center`}
          >
            <Text style={tw`text-sm px-2`}>{item.brand}</Text>

            <Text style={tw`text-sm px-2`}>{item.expiration_date}</Text>
          </View>
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

  const renderEmptyDate = () => {
    return (
      <View style={tw`flex-grow m-1`}>
        <Text>No items for this day</Text>
      </View>
    );
  };

  const renderDay = () => {
    return <View></View>;
  };

  return (
    <Agenda
      items={transformedItems}
      renderItem={renderItem}
      renderEmptyDate={renderEmptyDate}
      renderDay={renderDay}
      firstDay={1}
      theme={{
        background: "purple",
        todayTextColor: "purple",
        textMonthFontWeight: "semibold",
        selectedDayBackgroundColor: "purple",
        agendaTodayColor: "purple",
      }}
    />
  );
};

export default SkinCareAgenda;
