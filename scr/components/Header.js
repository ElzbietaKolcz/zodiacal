import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";

import { auth } from "../../firebase";
import { useDispatch } from "react-redux";


function Header() {
  const dispatch = useDispatch();
  const [displayName, setDisplayName] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setDisplayName(user.displayName);
      }
    });

    return unsubscribe;
  }, []);


  const navigation = useNavigation();

  return (
    <View style={tw`w-full  flex-row justify-between items-center p-4`}>
      <Text
        variant="headlineSmall"
        style={tw`p-2 mt-1 text-black font-medium`}
        testID="header-welcome-text"
      >
        Welcome {displayName}!
      </Text>
      <View style={tw`flex-row items-center justify-end `}>
        <Button
          style={tw`bg-fuchsia-700  rounded-lg`}
          mode="contained"
          textColor="#FFFFFF"
          
          onPress={() => navigation.navigate("Settings")}
          testID="button"
        >
          LOGOUT
        </Button>
      </View>
    </View>
  );
}

export default Header;
