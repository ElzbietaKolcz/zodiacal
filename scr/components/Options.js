import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Button, Provider } from "react-native-paper";

const Options = ({ options, onSelect }) => {
  const [visible, setVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
    closeMenu();
  };

  return (
    <Provider>
      <View>
        <Button onPress={openMenu}>Select Option</Button>
        {visible && (
          <ScrollView style={{ maxHeight: 200 }}>
            {options.map((option, index) => (
              <View key={index}>
                <Button onPress={() => handleOptionSelect(option)}>
                  {option}
                </Button>
              </View>
            ))}
          </ScrollView>
        )}
        {selectedOption && <Text>Selected Option: {selectedOption}</Text>}
      </View>
    </Provider>
  );
};

export default Options;
