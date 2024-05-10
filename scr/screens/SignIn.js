import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Image,
  View,
  Pressable,
  Text,
} from "react-native";
import images from "../../assets/images";
import { TextInput, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import tw from "twrnc";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useDispatch } from "react-redux";
import { login } from "../features/userSlice";
import { Formik } from "formik";
import * as yup from "yup";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google"

WebBrowser.maybeCompleteAuthSession();

const SignIn = ({ navigation }) => {
  const MAX_LOGIN_ATTEMPTS = 6;
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [disableLoginButton, setDisableLoginButton] = useState(false); 
  const [loginAttempts, setLoginAttempts] = useState(0); 

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.IOS,
    androidClientId: process.env.ANDROID,
    webClientId: process.env.WEBID
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleSignIn(authentication);
    }
  }, [response]);

  const handleGoogleSignIn = async (authentication) => {
    const credential = GoogleAuthProvider.credential(authentication.idToken);
    try {
      const result = await signInWithCredential(auth, credential);
      const user = result.user;
      dispatch(
        login({
          uid: user.uid,
        }),
      );
    } catch (error) {
      setError("Failed to sign in with Google");
    }
  };


  const validationSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
  });

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        if (disableLoginButton) return; 
        signInWithEmailAndPassword(auth, values.email, values.password)
          .then((userAuth) => {
            dispatch(
              login({
                uid: userAuth.user.uid,
              }),
            );
          })
          .catch(() => {
            setLoginAttempts(prevAttempts => prevAttempts + 1); 
            if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
              setError("Too many unsuccessful login attempts. \nPlease try again later.");
              setDisableLoginButton(true); 
              setTimeout(() => {
                setDisableLoginButton(false); 
                setLoginAttempts(0); 
                setError(null); 
              }, 180000); 
            } else {
              setError("Invalid email or password");
            }
          });
      }}
    >
      {({ values, handleSubmit, handleChange, isValid, errors }) => (
        <KeyboardAvoidingView behavior="height" style={tw`flex-1 overflow-hidden`}>
          <View style={tw`bg-white h-full w-full `}>
            <Image
              style={tw`h-full w-full  absolute`}
              source={images.bgSignIn}
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
                    style={tw`bg-fuchsia-100/90 text-black rounded-lg my-2`}
                    label="Email"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    left={<TextInput.Icon icon="email-outline" />}
                    accessibilityLabel="Email"
                  />
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
                    accessibilityLabel="Password"
                  />
                </View>

                <View style={tw`w-full`}>
                  <Pressable
                    onPress={handleSubmit}
                    disabled={!isValid || disableLoginButton} 
                    style={[
                      tw`rounded-full p-4 mb-3 mt-8`,
                      disableLoginButton ? tw`bg-gray-500` : (isValid ? tw`bg-[#9C27B0]` : tw`bg-gray-500`), 
                    ]}
                    testID="sign-in-button"
                  >
                    <Text style={tw`text-center text-lg uppercase text-white`}>
                      Sign in
                    </Text>
                  </Pressable>
                  <View>
                    <Text
                      style={[tw`text-red-500 text-center my-2`]}
                    >
                      {error}
                    </Text>
                  </View>
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
                      onPress={() => promptAsync()}
                    >
                      <Text style={tw`p-2 text-lg text-black `}>Google</Text>
                    </Button>

                    <Button
                      disabled={true}
                      style={tw`flex-row rounded-full mx-2 bg-white p-2 mb-3 mt-5`}
                      icon={() => (
                        <Icon
                          name="apple"
                          size={36}
                        />
                      )}
                    >
                      <Text style={tw`p-2 text-lg text-black`}>Apple</Text>
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
