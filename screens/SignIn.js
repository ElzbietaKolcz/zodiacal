import * as React from "react";
import {
  KeyboardAvoidingView,
  Image,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { TextInput } from "react-native-paper";
import styles from "../styles";
import images from "../images";

export default function SignIn() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <KeyboardAvoidingView className="flex-1">
      <View className="bg-white h-full w-full ">
        <Image
          className="h-full w-full absolute"
          source={images.bgSignIn}
          resizeMode="cover"
        ></Image>

        <View className="flex-row justify-around w-full absolute">
          <Image
            className="h-[250] w-[225] mt-14 "
            source={images.logo}
          />
        </View>

        <View className="h-full w-full flex justify-around mt-36  absolute">
          <View className="flex items-center mx-8 space-y-6">
            <View className="w-full ">
              <TextInput
                className="bg-fuchsia-100/80 rounded-lg"
                label="Email"
                value={email}
                onChangeText={(email) => setEmail(email)}
              />
            </View>
            <View className="w-full ">
              <TextInput
                className="bg-fuchsia-100/80 rounded-lg"
                label="Password"
                value={password}
                onChangeText={(password) => setPassword(password)}
                secureTextEntry
              />
            </View>

            <View className="w-full">
              <TouchableOpacity className="rounded-full p-4 mb-3 mt-5  bg-primary-100">
                <Text className="text-center text-lg uppercase text-white">
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-col justify-center">
              <Text className=" text-center text-lg">
                {" "}
                - Or sign in with -{" "}
              </Text>
              <View className="flex-row space-x-6 my-3">
                <TouchableOpacity className="flex-row rounded-full bg-white p-4 mb-3 mt-5">
                  <Image
                    className="h-[25] w-[25]  "
                    source={images.google}
                  />
                  <Text className="px-2 text-lg "> Google </Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row rounded-full bg-white p-4 mb-3 mt-5">
                  <Image
                    className="h-[30] w-[25]  "
                    source={images.apple}
                  />
                  <Text className="px-2 text-lg "> Apple </Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row justify-center">
                <Text className=" text-center text-lg ">
                  {" "}
                  Don't have an account?
                </Text>
                <TouchableOpacity>
                  <Text className="text-center text-lg font-semibold px-2 text-primary-100">
                    Sign up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
