import React from 'react';
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../features/userSlice";
import { auth } from "../firebase";
import { Text, Button } from "react-native-paper";
import tw from "twrnc";

function Header({ userName }) {
  const dispatch = useDispatch();
  const logoutOfApp = () => {
    dispatch(logout());
    auth.signOut();
  };

  return (
    <View style={tw`w-full flex-row justify-between items-center p-4`}>
      <Text
        variant="headlineSmall"
        style={tw`p-4 mt-1 text-black font-medium`}
      >
        Welcome back {userName}!
      </Text>

      <View style={tw`flex-row items-center justify-end `}>
        {userName ? (
          <Button
            style={tw`bg-fuchsia-700  rounded-lg`}
            mode="contained"
            textColor="#FFFFFF"
            onPress={logoutOfApp}
          >
            Logout
          </Button>
        ) : null}
      </View>
    </View>
  );
}

export default Header;
