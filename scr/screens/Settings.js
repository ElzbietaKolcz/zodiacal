import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Button, FAB, Text, TextInput } from "react-native-paper";
import * as yup from "yup"; // Import yup for validation
import { Formik } from "formik";
import { auth, updateUserProfile } from "../../firebase"; // Import Firebase auth and update profile function
import { useDispatch } from "react-redux";
import { logout } from "../features/userSlice";
import FormMenu from "../components/horoscop/FormMenu";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import tw from "twrnc";

function Settings() {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null); // State to manage current user
  const [initialValues, setInitialValues] = useState({
    username: "",
    email: "",
    password: "",
  }); // State to manage initial form values
  const [isFocused, setIsFocused] = useState(false); // State to manage input focus
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State to manage password visibility
  const [formChanged, setFormChanged] = useState({
    username: false,
    email: false,
    password: false,
  }); // State to track if form values have changed for each field


  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setInitialValues({
          username: currentUser.displayName || "",
          email: currentUser.email || "",
          password: "",
        });
      }
    });
    return unsubscribe;
  }, []);

  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .min(2, "Username must be at least 2 characters.")
      .max(32, "Username cannot contain more than 32 characters."),
    email: yup
      .string()
      .email("Please enter a valid email.")
      .min(5, "Email must be at least 5 characters.")
      .max(256, "Email cannot contain more than 256 characters."),
    password: yup
      .string()
      .matches(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+])/,
        "Password must contain at least one uppercase letter and one special character.",
      )
      .min(8, "Password must be at least 8 characters.")
      .max(256, "Password cannot contain more than 256 characters.")
      .required("Minimum 8 characters required."),
  });

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log("User successfully logged out");
      dispatch(logout());
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const handleSaveChanges = async (field) => {
    try {
      if (user) {
        switch (field) {
          case "username":
            await updateUserProfile(user, initialValues.username, user.email);
            console.log("Username updated successfully");
            setFormChanged({ ...formChanged, username: false });
            break;
          case "email":
            await updateUserProfile(
              user,
              user.displayName,
              initialValues.email,
            );
            console.log("Email updated successfully");
            setFormChanged({ ...formChanged, email: false });
            break;
          case "password":
            // Update password logic goes here (if applicable)
            console.log("Password update logic here");
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error.message);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={() => {}}
    >
      {({ values, handleChange, isValid, errors, isSubmitting }) => (
        <View style={tw`flex-1 overflow-hidden`}>
          <View style={tw`flex-col flex mx-8 `}>
            <View style={tw` flex-col`}>
            <Text
                variant="titleMedium"
                style={tw`px-2 mt-4 text-black font-medium`}
              >
                Change username
              </Text>
              <View style={tw`flex-row items-center`}>
                <View style={tw`w-5/6 `}>
                  <TextInput
                    style={tw`bg-fuchsia-100/80 rounded-lg my-2`}
                    value={values.username}
                    onChangeText={(text) => {
                      handleChange("username")(text);
                      setFormChanged({ ...formChanged, username: true });
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    label="Username"
                  />
                  {errors.username && (
                    <Text style={tw`text-red-500 font-semibold`}>
                      {errors.username}
                    </Text>
                  )}
                </View>
                <View style={tw` ml-8`}>
                  <FAB
                    disabled={isValid || isSubmitting}
                    style={[
                      tw` rounded-full items-center`,
                      isValid ? tw`bg-gray-500` : tw`bg-[#9C27B0]`,
                    ]}
                    size="small"
                    icon={() => (
                      <Icon
                        name="content-save"
                        size={22}
                        color="#FFFFFF"
                      />
                    )}
                    onPress={() => handleSaveChanges("username")}
                  />
                </View>
              </View>
            </View>

            <View style={tw` flex-col`}>
            <Text
                variant="titleMedium"
                style={tw`px-2 mt-4 text-black font-medium`}
              >
                Change email
              </Text>
              <View style={tw`flex-row items-center`}>
                <View style={tw`w-5/6 `}>
                  <TextInput
                    style={tw`bg-fuchsia-100/80 rounded-lg my-2`}
                    value={values.email}
                    onChangeText={(text) => {
                      handleChange("email")(text);
                      setFormChanged({ ...formChanged, email: true });
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    label="Email"
                  />
                  {errors.email && (
                    <Text style={tw`text-red-500 font-semibold`}>
                      {errors.email}
                    </Text>
                  )}
                </View>
                <View style={tw` ml-8`}>
                  <FAB
                    disabled={isValid || isSubmitting}
                    style={[
                      tw` rounded-full items-center`,
                      isValid ? tw`bg-gray-500` : tw`bg-[#9C27B0]`,
                    ]}
                    size="small"
                    icon={() => (
                      <Icon
                        name="content-save"
                        size={22}
                        color="#FFFFFF"
                      />
                    )}
                    onPress={() => handleSaveChanges("username")}
                  />
                </View>
              </View>
            </View>

            <View style={tw` flex-col`}>
              <Text
                variant="titleMedium"
                style={tw`px-2 mt-4 text-black font-medium`}
              >
                Change password
              </Text>
              <View style={tw`flex-row items-center`}>
                <View style={tw`w-5/6 `}>
                  <TextInput
                    style={tw`bg-fuchsia-100/80 rounded-lg my-2`}
                    value={values.password}
                    secureTextEntry={!isPasswordVisible}

                    onChangeText={(text) => {
                      handleChange("password")(text);
                      setFormChanged({ ...formChanged, password: true });
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    label="Password"
                    right={
                      <TextInput.Icon
                        icon={isPasswordVisible ? "eye-off" : "eye"}
                        onPress={togglePasswordVisibility}
                        color={isFocused ? "#a21caf" : "#535353"}
                      />
                    }
                  />
                  {errors.password && (
                    <Text style={tw`text-red-500 font-semibold`}>
                      {errors.password}
                    </Text>
                  )}
                </View>
                <View style={tw` ml-8`}>
                  <FAB
                    disabled={isValid || isSubmitting}
                    style={[
                      tw` rounded-full items-center`,
                      isValid ? tw`bg-gray-500` : tw`bg-[#9C27B0]`,
                    ]}
                    size="small"
                    icon={() => (
                      <Icon
                        name="content-save"
                        size={22}
                        color="#FFFFFF"
                      />
                    )}
                    onPress={() => handleSaveChanges("username")}
                  />
                </View>
              </View>
            </View>
            
            <Text
                variant="titleMedium"
                style={tw`px-2 mt-4 text-black font-medium`}
              >
                Change sign
              </Text>
            <FormMenu  style={tw`w-5/6 m-0 p-0`} />
            <View style={tw`flex-row w-full items-center  mt-8`}>
              <Button
                style={tw`bg-fuchsia-700 w-full rounded-lg`}
                mode="contained"
                textColor="#FFFFFF"
                onPress={handleLogout}
              >
                Logout
              </Button>
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
}

export default Settings;
