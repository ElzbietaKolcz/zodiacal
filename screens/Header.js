import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import tw from "twrnc";
import { auth } from "../firebase";

function Header() {
  const [displayName, setDisplayName] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setDisplayName(user.displayName);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error.message);
    }
  };

  return (
    <View style={tw`w-full flex-row justify-between items-center p-4`}>
      <Text
        variant="headlineSmall"
        style={tw`p-2 mt-1 text-black font-medium`}
      >
        Welcome back {displayName ? displayName : "Guest"}!
      </Text>
      <View style={tw`flex-row items-center justify-end `}>
        <Button
          style={tw`bg-fuchsia-700  rounded-lg`}
          mode="contained"
          textColor="#FFFFFF"
          onPress={handleLogout}
        >
          Logout
        </Button>
      </View>
    </View>
  );
}

export default Header;
