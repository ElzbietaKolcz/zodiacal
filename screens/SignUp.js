import { useNavigation } from "@react-navigation/native";
import * as React from "react";
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
import { getAuth, createUserWithEmailAndPassword, updateProfile  } from "firebase/auth";

const SignIn = () => {
  const navigation = useNavigation();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState("");

  const handleSignUp = () => {
    const auth = getAuth();


    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        
        updateProfile(user, { username })
          .then(() => {
            console.log("Ustawiono nazwę użytkownika:", username);
          })
          .catch((error) => {
            console.error("Błąd podczas ustawiania nazwy użytkownika:", error);
          });

        console.log("Utworzono użytkownika:", user);
        navigation.replace("SignIn");
      })
      .catch((error) => {
        console.error("Błąd podczas tworzenia użytkownika:", error);
      });
  };

  return (
    <KeyboardAvoidingView style={tw`flex-1`}>
      <View style={tw`bg-white h-full w-full`}>
        <Image
          style={tw`h-full w-full absolute`}
          source={images.bgSignUp}
          resizeMode="cover"
        ></Image>

        <View style={tw`flex-row justify-around w-full absolute`}>
          <Image
            style={tw`h-[60] w-[45] mt-16`}
            source={images.logo}
          />
        </View>

        <View style={tw`h-full w-full flex justify-around mt-25 absolute`}>
          <View style={tw`flex items-center mx-8 `}>
            <View style={tw`w-full`}>
              <TextInput
                style={tw`bg-fuchsia-100/80 rounded-lg my-2`}
                label="Username"
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
            </View>
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
              <Pressable onPress={() => handleSignUp(username)}
                style={tw`rounded-full p-4 mb-3 mt-8 bg-[#9C27B0]`}
              >
                <Text style={tw`text-center text-lg uppercase text-white`}>
                  Sign up
                </Text>
              </Pressable>
            </View>

            <View style={tw`flex-col justify-center`}>
              <View style={tw`flex-row justify-center`}>
                <Text style={tw`text-center text-lg mt-10`}>
                  {" "}
                  Do you have an account?
                </Text>
                <Pressable onPress={() => navigation.navigate("SignIn")}>
                  <Text
                    style={tw`text-center text-lg font-semibold px-2 mt-10 text-[#9C27B0]`}
                  >
                    Log in
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
