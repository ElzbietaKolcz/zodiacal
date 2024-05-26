import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Button, Provider, FAB } from "react-native-paper";
import tw from "twrnc";

const Options = ({ options, onSelect, handleFABPress }) => {
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
        <View style={tw`flex-grow flex-row justify-between flex items-start`}>
          <Button
            contentStyle={tw`bg-transparent justify-start border-b-2 w-96 text-lg font-bold mt-3`}
            labelStyle={tw`text-black text-left`}
            onPress={openMenu}
          >
            Select product:
          </Button>
          <FAB
            style={tw`bg-fuchsia-700 rounded-full m-2`}
            size="small"
            icon="plus"
            color="#FFFFFF"
            onPress={handleFABPress}
            mode="elevated"
            accessibilityLabel="FAB"
          />
        </View>
        {visible && (
          <ScrollView style={{ maxHeight: 200 }}>
            {options.map((option, index) => (
              <View key={index}>
                <Button
                  labelStyle={tw`text-fuchsia-800 font-bold`}
                  onPress={() => handleOptionSelect(option)}
                >
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
