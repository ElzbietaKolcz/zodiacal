import React, { useState, useEffect } from "react";
import { View, Button, Text, ScrollView } from "react-native";
import tw from "twrnc";

const NavigationSkinCare = () => {
  const navigation = useNavigation();

  return (
    
    <View style={tw` flex flex-row mt-8 items-center `}>
            
      <Button
        title="Summary"
        onPress={() => navigation.navigate("Summary")}
      />
      <Button
        title="Routines"
        onPress={() => navigation.navigate("Routines")}
      />
    </View>
  );
};

export default NavigationSkinCare;
