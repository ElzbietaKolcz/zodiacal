import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Checkbox } from "react-native-paper";
import tw from "twrnc";
import { Agenda } from "react-native-calendars";
import MenuRoutines from "../../components/skinCare/MenuRoutines";
import { collection, query, getDocs } from "firebase/firestore";
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
  const [checked, setChecked] = useState(false);
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
        const { product_name, brand, expiration_date, tag } = doc.data();
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
          state: false,
          tag,
          brand,
          expiration_date,
        }); // Assuming state is initially false for skincare items
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
        const { product_name, brand, expiration_date, tag } = doc.data();
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
          state: false,
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

  const handleCheckboxPress = () => {
    setChecked(!checked);
  };

  const renderEmptyDate = () => {
    return (
      <View style={tw`flex-grow m-1`}>
        <Text>No items for this day</Text>
      </View>
    );
  };

  const renderItem = (item) => {
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
      <TouchableOpacity
        style={tw`flex-row flex items-center text-black rounded-lg flex-1`}
      >
        <View style={tw`flex-grow m-1 bg-fuchsia-200 rounded-lg p-2 mx-4 mt-2`}>
          <Text style={tw`text-base font-semibold px-2`}>{item.name}</Text>
          <View
            style={tw`flex-grow flex-row justify-between flex items-center`}
          >
            <Text style={tw`text-sm px-2`}>{item.brand}</Text>
            <Text style={tw`text-sm px-2`}>{item.expiration_date}</Text>
          </View>
        </View>
        <View style={tw`rounded-lg mr-4`}>
          <Checkbox
            status={checked ? "checked" : "unchecked"}
            uncheckedColor="#535353"
            color="#8D03A5"
            onPress={handleCheckboxPress}
            testID="checkbox"
          />
        </View>
      </TouchableOpacity>
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
