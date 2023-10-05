import * as React from "react";
import {
  KeyboardAvoidingView,
  ImageBackground,
  Text,
  View,
} from "react-native";

import { TextInput } from "react-native-paper";

export default function SignIn() {
  const bgSignIn = {
    uri: "https://firebasestorage.googleapis.com/v0/b/zodiacal-977ae.appspot.com/o/background%2Fbg-signIn.jpg?alt=media&token=ed49bbaf-84a5-4c80-a483-b4a3d345fb64",
  };
  const [text, setText] = React.useState("");

  return (
    <KeyboardAvoidingView className="flex-1">
      <ImageBackground
        className="flex-1 justify-center"
        source={bgSignIn}
        resizeMode="cover"
      >
        <Text className="text-5xl text-center">ZodiaCal</Text>

        <View className=" flex-1 w-3/4">
          <TextInput
            label="Email"
            value={text}
            onChangeText={(text) => setText(text)}
          />
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}
