import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Image,
  View,
  Pressable,
  Text,
} from "react-native";
import images from "../../assets/images";
import { TextInput } from "react-native-paper";
import tw from "twrnc";

import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { useDispatch } from "react-redux";
import { auth, db } from "../../firebase";
import { login } from "../features/userSlice";

import { Formik } from "formik";
import * as yup from "yup";

const SignUp = ({ navigation }) => {

  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .required("Username is required.")
      .min(2, "Username must be at least 2 characters.")
      .max(32, "Username cannot contain more than 32 characters."),
    email: yup
      .string()
      .email("Please enter a valid email.")
      .required("Email address is required.")
      .min(5, "Email must be at least 5 characters.")
      .max(256, "Email cannot contain more than 256 characters."),
    password: yup
      .string()
      .matches(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+])/, 
        "Password must contain at least one uppercase letter and one special character."
      )
      .min(8, "Password must be at least 8 characters.")
      .max(256,"Password cannot contain more than 256 characters.")
      .required("Minimum 8 characters required."),
  });
  

  return (
    <Formik
      initialValues={{ username: "", email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        createUserWithEmailAndPassword(auth, values.email, values.password)
          .then((userAuth) => {
            updateProfile(userAuth.user, {
              displayName: values.username,
            }).then(() => {
              const userId = userAuth.user.uid;
              const userDocRef = doc(db, "users", userId);
              setDoc(userDocRef, {
                username: values.username,
                sign: "", 
              }).then(() => {
                dispatch(
                  login({
                    uid: userAuth.user.uid,
                    displayName: values.username,
                  })
                );
              }).catch((error) => {
                console.error(
                  "Error occurred while saving user data.",
                  error,
                );
              });
            });
          })
          .catch((error) => {
            if (error.code === "auth/email-already-in-use") {
              setError(
                "This email is already in use. Please use a different email.",
              );
            }
            setSubmitting(false);
          });
      }}
    >
      {({
        values,
        handleSubmit,
        handleChange,
        isValid,
        errors,
        isSubmitting,
      }) => (
        <KeyboardAvoidingView style={tw`flex-1 overflow-hidden`}>
          <View style={tw`bg-white h-full w-full`}>
            <Image
              style={tw`h-full w-full absolute`}
              source={images.bgSignUp}
              resizeMode="cover"
            ></Image>

            <View style={tw`flex-row justify-around w-full absolute`}>
              <Image
                style={tw`h-[60] w-[45] mt-10`}
                source={images.logo}
              />
            </View>

            <View style={tw`h-full w-full flex justify-around mt-25 absolute`}>
              <View style={tw`flex items-center mx-8 `}>
                {/* Username input */}
                <View style={tw`w-full`}>
                  <TextInput
                    style={tw`bg-fuchsia-100/80 rounded-lg my-2`}
                    label="Username"
                    value={values.username}
                    onChangeText={handleChange("username")}
                    left={<TextInput.Icon icon="account-outline" />}
                    accessibilityLabel="Username"
                  />
                  {errors.username ? (
                    <Text style={tw`text-red-500`}>{errors.username}</Text>
                  ) : null}
                </View>

                {/* Email input */}
                <View style={tw`w-full`}>
                  <TextInput
                    style={tw`bg-fuchsia-100/80 rounded-lg my-2`}
                    label="Email"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    left={<TextInput.Icon icon="email-outline" />}
                    accessibilityLabel="Email"

                  />
                  {errors.email ? (
                    <Text style={tw`text-red-500`}>{errors.email}</Text>
                  ) : null}
                </View>
                <View style={tw`w-full`}>
                  {/* Password input */}
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
                    accessibilityLabel="Password"
                  />
                  {errors.password ? (
                    <Text style={tw`text-red-500`}>{errors.password}</Text>
                  ) : null}
                </View>

                {/* Button Sign Up */}
                <View style={tw`w-full`}>
                  {error && (
                    <Text style={tw`text-red-500 text-center my-2`}>
                      {error}
                    </Text>
                  )}
                  <Pressable
                    onPress={handleSubmit}
                    disabled={!isValid || isSubmitting}
                    style={[
                      tw`rounded-full p-4 mb-3 mt-8`,
                      isValid ? tw`bg-[#9C27B0]` : tw`bg-gray-500`,
                    ]}
                    testID="sign-up-button"
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

                    {/* Button Sign In*/}
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
      )}
    </Formik>
  );
};

export default SignUp;
