import React, { useState } from "react";
import { View, Text } from "react-native";
import { Menu, Button, IconButton } from "react-native-paper";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const MenuRoutines = ({ onSelectSubcategory }) => {
  const [visible, setVisible] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const subcategories = [
    "Exfoliation",
    "Moisturizing",
    "Reconstruction",
    "Break",
  ];

  const handleMenuSelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
    onSelectSubcategory(subcategory);
    closeMenu();
  };

  return (
    <View style={tw`m-2`}>
      <View style={tw`flex-row items-center`}>
        <Text style={tw`text-base font-light`}>
          <Text style={tw`font-semibold text-base`}>Type:</Text>{" "}
          {selectedSubcategory || "Select a type"}
        </Text>
        <IconButton
          icon={() => (
            <Icon
              name="chevron-down"
              size={20}
              style={tw`bg-transparent border border-black rounded-full`}
            />
          )}
          onPress={openMenu}
        />
      </View>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Button onPress={openMenu} />}
      >
        {subcategories.map((subcategory) => (
          <Menu.Item
            key={subcategory}
            onPress={() => handleMenuSelect(subcategory)}
            title={subcategory}
          />
        ))}
      </Menu>
    </View>
  );
};

export default MenuRoutines;
