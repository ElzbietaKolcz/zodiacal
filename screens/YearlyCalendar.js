import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import tw from "twrnc";
import { TextInput, FAB, Text, HelperText } from "react-native-paper";

import { Formik } from "formik";
import * as yup from "yup";

import MonthCalendar from "./MonthCalendar";

const YearlyCalendar = () => {
  const currentYear = new Date().getFullYear();

  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  const [userBirthdays, setUserBirthdaysData] = useState([]);
  const [setInputDay] = useState("");
  const [setInputMonth] = useState("");
  const [setInputName] = useState("");

  const validationSchema = yup.object().shape({
    day: yup
      .number()
      .integer()
      .typeError("Must be a number")
      .min(1, "Must be at least 1")
      .max(31, "Must be at most 31")
      .required("Required"),
    month: yup
      .number()
      .integer()
      .typeError("Must be a number")
      .min(1, "Must be at least 1")
      .max(12, "Must be at most 12")
      .required("Required"),
    name: yup
      .string()
      .min(2, "Too short")
      .max(20, "Too long")
      .required("Required"),
  });

  const fetchData = async (collectionRef, setData) => {
    try {
      const q = query(collectionRef, orderBy("day"));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setData(data);
    } catch (error) {
      console.error("Błąd podczas pobierania danych:", error.message);
    }
  };

  const addNewUserBirthday = async (day, month, name) => {
    try {
      if (user) {
        const userId = user.uid;
        const userBirthdaysCollectionRef = collection(
          db,
          `users/${userId}/birthday`,
        );

        const newUserBirthdayData = {
          name: name,
          day: parseInt(day, 10),
          month: parseInt(month, 10),
        };

        const docRef = await addDoc(
          userBirthdaysCollectionRef,
          newUserBirthdayData,
        );

        fetchData(userBirthdaysCollectionRef, setUserBirthdaysData);
        setInputName("");
        setInputDay("");
        setInputMonth("");
      }
    } catch (error) {
      console.error(
        "Błąd podczas dodawania nowych urodzin użytkownika:",
        error.message,
      );
    }
  };

  useEffect(() => {
    if (user) {
      const userId = user.uid;
      const userBirthdaysCollectionRef = collection(
        db,
        `users/${userId}/birthday`,
      );

      fetchData(userBirthdaysCollectionRef, setUserBirthdaysData);
    }
  }, [user]);

  return (
    <Formik
      initialValues={{ day: "", month: "", name: "" }}
      onSubmit={async (values, actions) => {
        try {
          await addNewUserBirthday(values.day, values.month, values.name);
          actions.resetForm();
        } catch (error) {
          console.error(
            "Błąd podczas dodawania nowych urodzin użytkownika:",
            error.message,
          );
        } finally {
          actions.setSubmitting(false);
        }
      }}
      validationSchema={validationSchema}
    >
      {({
        values,
        handleSubmit,
        handleChange,
        isValid,
        errors,
        isSubmitting,
      }) => (
        <ScrollView style={tw` bg-white h-full w-full`}>
          <View style={tw` mt-2`}>
            <Text
              style={tw` mt-6 ml-4 text-black`}
              variant="titleLarge"
            >
              Add new data
            </Text>

            <View style={tw`flex-row flex-wrap mt-6`}>
              <View style={tw`flex-grow mb-2 ml-2`}>
                <TextInput
                  style={tw`bg-fuchsia-50 rounded-lg mx-1 `}
                  label="Day"
                  value={values.day}
                  onChangeText={handleChange("day")}
                  activeUnderlineColor="#a21caf"
                />
                <HelperText
                  type="error"
                  visible={errors.day ? true : false}
                >
                  {errors.day}
                </HelperText>
              </View>

              <View style={tw`flex-grow mb-2`}>
                <TextInput
                  style={tw`bg-fuchsia-50 rounded-lg mx-1  `}
                  label="Month"
                  value={values.month}
                  onChangeText={handleChange("month")}
                  activeUnderlineColor="#a21caf"
                />
                <HelperText
                  type="error"
                  visible={errors.month ? true : false}
                >
                  {errors.month}
                </HelperText>
              </View>

              <View style={tw`flex-grow mb-2`}>
                <TextInput
                  style={tw`bg-fuchsia-50 rounded-lg mx-1 `}
                  label="Name"
                  value={values.name}
                  onChangeText={handleChange("name")}
                  activeUnderlineColor="#a21caf"
                />
                <HelperText
                  type="error"
                  visible={errors.name ? true : false}
                >
                  {errors.name}
                </HelperText>
              </View>

              <View style={tw`m-3`}>
                <FAB
                  onPress={handleSubmit}
                  disabled={!isValid || isSubmitting}
                  style={[
                    tw`bg-fuchsia-700 rounded-full  right-1`,
                    isValid ? tw`bg-[#9C27B0]` : tw`bg-gray-500`,
                  ]}
                  size="small"
                  icon="plus"
                  color="#FFFFFF"
                  mode="elevated"
                />
              </View>
            </View>
          </View>
          <View style={tw`mt-1`}>
            <View style={tw`flex-col flex-wrap mt-4`}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                <MonthCalendar
                  key={month}
                  currentYear={currentYear}
                  month={month}
                  userBirthdays={userBirthdays}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
};

export default YearlyCalendar;
