import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Checkbox } from "react-native-paper";
import tw from "twrnc";
import { Agenda } from "react-native-calendars";
import MenuRoutines from "../../components/skinCare/MenuRoutines";

const transformItemsForAgenda = (items, selectedSubcategory) => {
  let transformedItems = {};
  for (const date in items) {
    transformedItems[date] = [];
    for (const period in items[date]) {
      if (period === "Morning" || period === "Evening") {
        transformedItems[date].push({
          period: period,
          isCategory: true,
        });
        if (period === "Evening") {
          if (
            selectedSubcategory &&
            items[date][period]["5"] &&
            items[date][period]["5"][selectedSubcategory]
          ) {
            items[date][period]["5"][selectedSubcategory].forEach((item) => {
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

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(null);
    setSelectedSubcategory(subcategory);
  };
  const handleCheckboxPress = () => {
    setChecked(!checked);
  };

  useEffect(() => {
  }, [selectedSubcategory]);

  const items = {
    "2024-05-26": {
      Morning: [
        {
          product_name: "Hydrating Facial Cleanser",
          brand: "SoftTouch",
          expiration_date: "2023-06-25",
        },
        {
          product_name: "Hyaluronic Acid Serum",
          brand: "SkinRevive",
          expiration_date: "2023-08-10",
        },
        {
          product_name: "Collagen-Boosting Cream",
          brand: "CollagenRich",
          expiration_date: "2023-10-25",
        },
        {
          product_name: "UV Defense Sunscreen",
          brand: "SunShield",
          expiration_date: "2023-08-15",
        },
      ],
      Evening: {
        "5" : {
        Exfoliation: [
          {
            product_name: "Hydrating Facial Cleanser",
            brand: "SoftTouch",
            expiration_date: "2023-06-25",
          },
          {
            product_name: "Mandelic Acid 30%",
            brand: "Nacomi Next Level",
            expiration_date: "2023-07-20",
          },
        ],
        Moisturizing: [
          {
            product_name: "Mandelic Acid 30%",
            brand: "SoftTouch",
            expiration_date: "2023-06-25",
          },
          {
            product_name: "Hyaluronic Acid Serum",
            brand: "SkinRevive",
            expiration_date: "2023-08-10",
          },
        ],
        Reconstruction: [
          {
            product_name: "sdfsdf",
            brand: "SoftTouch",
            expiration_date: "2023-06-25",
          },
          {
            product_name: "dfsdfsdfsdf",
            brand: "SoftTouch",
            expiration_date: "2023-06-25",
          },
          {
            product_name: "Mdasd0%",
            brand: "SoftTouch",
            expiration_date: "2023-06-25",
          },
          {
            product_name: "Hyasdasd",
            brand: "SkinRevive",
            expiration_date: "2023-08-10",
          },
        ],
        Break: [
          {
            product_name: "Have a good evening! :)",
            brand: "",
            expiration_date: "",
          },
        ],
        },
      },
    },
  };

  const transformedItems = transformItemsForAgenda(items, selectedSubcategory);

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
          <Text style={tw`text-lg font-bold mx-2 mt-3 p-2`}>{item.period}</Text>
          {item.period === "Evening" && !selectedSubcategory && (
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
          <Text style={tw`text-base font-semibold px-2`}>
            {item.product_name}
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
