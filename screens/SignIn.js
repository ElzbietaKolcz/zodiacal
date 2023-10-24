import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Image,
  View,
  Pressable,
  Text,
} from "react-native";
import images from "../images";
import { TextInput, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import tw from "twrnc";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase";

import { useDispatch } from "react-redux";
import { login } from "../features/userSlice";

const SignIn = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSignIn = () => {
    const auth = getAuth(app);

    signInWithEmailAndPassword(auth, email, password).then((userAuth) => {
      dispatch(
        login({
          email: userAuth.user.email,
          uid: userAuth.user.uid,
        }),
      );
    });
  };

  return (
    <KeyboardAvoidingView style={tw`flex-1`}>
      <View style={tw`bg-white h-full w-full`}>
        <Image
          style={tw`h-full w-full absolute`}
          source={images.bgSignIn}
          resizeMode="cover"
        ></Image>

        <View style={tw`flex-row justify-around w-full absolute`}>
          <Image
            style={tw`h-[60] w-[45] mt-16`}
            source={images.logo}
          />
        </View>

        <View style={tw`h-full w-full flex justify-around mt-34 absolute`}>
          <View style={tw`flex items-center mx-8 `}>
            <View style={tw`w-full`}>
              <TextInput
                style={tw`bg-fuchsia-100/80 rounded-lg my-2`}
                label="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                left={<TextInput.Icon icon="email-outline" />}

                // error={true}
              />
            </View>
            <View style={tw`w-full`}>
              <TextInput
                style={tw`bg-fuchsia-100/80 rounded-lg my-2`}
                label="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={!isPasswordVisible}
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon
                    icon={isPasswordVisible ? "eye-off" : "eye"}
                    onPress={togglePasswordVisibility}
                  />
                }
              />
            </View>

            <View style={tw`w-full`}>
              <Pressable
                onPress={handleSignIn}
                style={tw`rounded-full p-4 mb-3 mt-8 bg-[#9C27B0]`}
              >
                <Text style={tw`text-center text-lg uppercase text-white`}>
                  Sign in
                </Text>
              </Pressable>
            </View>

            <View style={tw`flex-col justify-center mt-4`}>
              <Text style={tw`text-center text-lg`}> - Or sign in with - </Text>
              <View style={tw`flex-row my-3 mb-6 `}>
                <Button
                  style={tw`flex-row rounded-full mx-2 bg-white p-2 mb-3 mt-5`}
                  icon={() => (
                    <Icon
                      name="google"
                      size={36}
                    />
                  )}
                >
                  <Text style={tw`p-2 text-lg`}>Google</Text>
                </Button>

                <Button
                  disabled={true}
                  style={tw`flex-row rounded-full mx-2 bg-gray-200 p-2 mb-3 mt-5`}
                  icon={() => (
                    <Icon
                      name="apple"
                      size={36}
                      color="#888"
                    />
                  )}
                >
                  <Text style={tw`p-2 text-lg`}>Apple</Text>
                </Button>
              </View>

              <View style={tw`flex-row justify-center`}>
                <Text style={tw`text-center text-lg`}>
                  {" "}
                  Don't have an account?
                </Text>
                <Pressable onPress={() => navigation.navigate("SignUp")}>
                  <Text
                    style={tw`text-center text-lg font-semibold px-2 text-[#9C27B0]`}
                  >
                    Sign up
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
