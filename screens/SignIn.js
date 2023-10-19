import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { View, Text, Button } from "react-native";
import useAuth from "../hooks/useAuth";

const SignIn = () =>{
  const navigation = useNavigation();
  const{user} =useAuth();
  console.log(user)

  return (
    
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>SigIn page</Text>
      <Button
        title="Sign in"
        onPress={() => navigation.navigate("Home")}
      ></Button>
    </View>
  );
}

export default SignIn;
