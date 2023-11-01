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
import { Formik } from "formik";
import * as yup from "yup";

const SignIn = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email.")
      .required("Email Address is required."),
    password: yup
      .string()
      .min(6)
      .max(24)
      .required("Minimum 6 characters required."),
  });

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const auth = getAuth(app);
        signInWithEmailAndPassword(auth, values.email, values.password)
          .then((userAuth) => {
            dispatch(
              login({
                email: userAuth.user.email,
                uid: userAuth.user.uid,
              }),
            );
          })
          .catch((error) => console.error("Login error", error.message));
      }}
    >
      {({ values, handleSubmit, handleChange, isValid, errors }) => (
        <KeyboardAvoidingView style={tw`flex-1`}>
          <View style={tw`bg-white h-full w-full`}>
            <Image
              style={tw`h-full w-full absolute`}
              source={images.bgSignIn}
              resizeMode="cover"
            ></Image>

            <View style={tw`flex-row justify-around w-full absolute`}>
              <Image
                style={tw`h-[60] w-[45] mt-10`}
                source={images.logo}
              />
            </View>

            <View style={tw`h-full w-full flex justify-around mt-30 absolute`}>
              <View style={tw`flex items-center mx-8 `}>
                <View style={tw`w-full`}>
                  <TextInput
                    style={tw`bg-fuchsia-100/80 rounded-lg my-2`}
                    label="Email"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    left={<TextInput.Icon icon="email-outline" />}
                  />
                  {errors.email ? (
                    <Text style={tw`text-red-500`}>{errors.email}</Text>
                  ) : null}
                </View>
                <View style={tw`w-full`}>
                  <TextInput
                    style={tw`bg-fuchsia-100/80 rounded-lg my-2`}
                    label="Password"
                    value={values.password}
                    onChangeText={handleChange("password")}
                    secureTextEntry={!isPasswordVisible}
                    left={<TextInput.Icon icon="lock-outline" />}
                    right={
                      <TextInput.Icon
                        icon={isPasswordVisible ? "eye-off" : "eye"}
                        onPress={togglePasswordVisibility}
                      />
                    }
                  />
                  {errors.password ? (
                    <Text style={tw`text-red-500`}>{errors.password}</Text>
                  ) : null}
                </View>

                <View style={tw`w-full`}>
                  <Pressable
                    onPress={handleSubmit}
                    disabled={!isValid}
                    style={tw`rounded-full p-4 mb-3 mt-8 bg-[#9C27B0]`}
                  >
                    <Text style={tw`text-center text-lg uppercase text-white`}>
                      Sign in
                    </Text>
                  </Pressable>
                </View>

                <View style={tw`flex-col justify-center mt-4`}>
                  <Text style={tw`text-center text-lg`}>
                    {" "}
                    - Or sign in with -{" "}
                  </Text>
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
      )}
    </Formik>
  );
};

export default SignIn;
