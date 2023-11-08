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
import { TextInput } from "react-native-paper";
import tw from "twrnc";

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

import { useDispatch } from "react-redux";
import { app } from "../firebase";
import { login } from "../features/userSlice";

import { Formik } from "formik";
import * as yup from "yup";

const SignUp = () => {
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [toDo, setToDo] = useState("");

  const handleToDoChange = (text) => {
    setToDo(text);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validationSchema = yup.object().shape({
    username: yup.string().required("Username is required."),
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
      initialValues={{ username: "", email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const auth = getAuth(app);
        createUserWithEmailAndPassword(auth, values.email, values.password)
          .then((userAuth) => {
            updateProfile(userAuth.user, {
              displayName: values.username,
            })
              .then(() => {
                const db = getFirestore(app);
                const userId = userAuth.user.uid;

                const userDocRef = doc(db, "users", userId);

                setDoc(userDocRef, {
                  username: values.username,
                  email: values.email,
                  toDo: toDo,
                })
                  .then(() => {
                    dispatch(
                      login({
                        email: userAuth.user.email,
                        uid: userAuth.user.uid,
                        displayName: values.username,
                      }),
                    );
                  })
                  .catch((error) => {
                    console.error(
                      "Błąd podczas zapisywania danych użytkownika:",
                      error,
                    );
                  });
              })
              .catch((error) => {
                console.log("user not updated", error.message);
              });
          })
          .catch((error) => console.error("Login error", error.message));
      }}
    >
      {({ values, handleSubmit, handleChange, isValid, errors }) => (
        <KeyboardAvoidingView style={tw`flex-1`}>
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
                <View style={tw`w-full`}>
                  <TextInput
                    style={tw`bg-fuchsia-100/80 rounded-lg my-2`}
                    label="Username"
                    value={values.username}
                    onChangeText={handleChange("username")}
                    left={<TextInput.Icon icon="account-outline" />}
                  />
                  {errors.username ? (
                    <Text style={tw`text-red-500`}>{errors.username}</Text>
                  ) : null}
                </View>

                {/* Test */}

                <TextInput
                  style={tw`bg-fuchsia-100/80 rounded-lg my-2`}
                  label="Zadanie"
                  value={toDo}
                  onChangeText={handleToDoChange}
                />

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
      )}
    </Formik>
  );
};

export default SignUp;
