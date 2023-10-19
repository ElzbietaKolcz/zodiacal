import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  KeyboardAvoidingView,
  Image,
  View,
  Pressable,
  Text,
} from "react-native";
import images from "../images";
import { TextInput } from "react-native-paper";
import tw from "twrnc";
import { auth } from "../firebase";


const SignIn = () => {
  const navigation = useNavigation();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Home");
      }
    });

    return () => {
      // Clean up the subscription when the component unmounts
      unsubscribe();
    };
  }, []);

  const signIn = () => {};

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
              />
            </View>
            <View style={tw`w-full`}>
              <TextInput
                style={tw`bg-fuchsia-100/80 rounded-lg my-2`}
                label="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
              />
            </View>

            <View style={tw`w-full`}>
              <Pressable
                onPress={signIn}
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
                <Pressable
                  style={tw`flex-row rounded-full mx-4 bg-white p-4 mb-3 mt-5`}
                >
                  <Image
                    style={tw`h-[8] w-[8]`}
                    source={images.google}
                  />
                  <Text style={tw`p-2 `}> Google </Text>
                </Pressable>
                <Pressable
                  style={tw`flex-row rounded-full mx-4 bg-white p-4 mb-3 mt-5`}
                >
                  <Image
                    style={tw`h-[8] w-[6.5]`}
                    source={images.apple}
                  />
                  <Text style={tw`p-2 `}> Apple </Text>
                </Pressable>
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
