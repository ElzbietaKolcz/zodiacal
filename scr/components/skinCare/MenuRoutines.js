import React, { useState } from "react";
import { View, Text } from "react-native";
import { Menu, Button } from "react-native-paper";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Definicje ikonek dla kategorii
const subcategoryIcons = {
  exfoliation: "eraser",
  moisturizing: "water",
  reconstruction: "leaf",
  break: "coffee",
};

const MenuRoutines = ({ onSelectSubcategory }) => {
  const [visible, setVisible] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const subcategories = [
    "exfoliation",
    "moisturizing",
    "reconstruction",
    "break",
  ];

  const handleMenuSelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
    onSelectSubcategory(subcategory);
    closeMenu();
  };

  return (
    <View style={tw`m-2`}>
      <View style={tw`flex-row flex flex-row items-center mt-3`}>
        <Text style={tw`text-base font-light `}>
          <Text style={tw`font-semibold text-base `}>Type:</Text>{" "}
          {selectedSubcategory ? (
            <>
              <Icon name={subcategoryIcons[selectedSubcategory]} size={15}   color="#9C27B0"/>{" "}
              {selectedSubcategory}
            </>
          ) : (
            "Select a type"
          )}
        </Text>
        <Button onPress={openMenu} icon={() => <Icon name="chevron-down" size={20}  />} />
      </View>
      <Menu
        visible={visible}
        contentStyle ={tw`bg-fuchsia-800`}
        onDismiss={closeMenu}
        anchor={<Button onPress={openMenu} />}
      >
        {subcategories.map((subcategory) => (
          <Menu.Item
            key={subcategory}
            onPress={() => handleMenuSelect(subcategory)}
            title={subcategory}
            leadingIcon={() => <Icon name={subcategoryIcons[subcategory]} size={20} color="white" />}
          />
        ))}
      </Menu>
    </View>
  );
};

export default MenuRoutines;