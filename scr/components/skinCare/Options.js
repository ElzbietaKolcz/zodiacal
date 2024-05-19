import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Button, Provider } from "react-native-paper";
import tw from "twrnc";

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
        <Button style={tw`bg-fuchsia-800 rounded-lg text-lg font-bold p-1 mx-1 mt-5`} labelStyle={tw`text-white font-bold `} onPress={openMenu}>Select product</Button>
        {visible && (
          <ScrollView style={{ maxHeight: 200 }}>
            {options.map((option, index) => (
              <View key={index}>
                <Button labelStyle={tw`text-fuchsia-800 font-bold `} onPress={() => handleOptionSelect(option)}>
                  {option}
                </Button>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </Provider>
  );
};

export default Options;
