import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import {
  TextInput,
  FAB,
  Text,
  HelperText,
  Modal,
  Portal,
  PaperProvider,
} from "react-native-paper";
import tw from "twrnc";

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../../../firebase";

import { Formik } from "formik";
import * as yup from "yup";

import MonthCalendar from "../../components/MonthCalendar";
import EditBirthdays from "./EditBirthdays";

import { useDispatch, useSelector } from "react-redux";
import { setBirthdays } from "../../features/birthdaySlice";
import { currentYear } from "../../../variables";

const YearlyCalendar = () => {
  const [inputday, setInputDay] = useState("");
  const [inputMonth, setInputMonth] = useState("");
  const [inputName, setInputName] = useState("");
  const user = auth.currentUser;
  const holidays = useSelector((state) => state.holidays);

  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

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

  const fetchData = async (collectionRef) => {
    try {
      const q = query(collectionRef, orderBy("day"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      dispatch(setBirthdays(data));
    } catch (error) {
      console.error("Error while downloading data:", error.message);
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
        setInputName("");
        setInputDay("");
        setInputMonth("");
        fetchData(userBirthdaysCollectionRef);
      }
    } catch (error) {
      console.error(
        "Error adding new user birthday:",
        error.message,
      );
    }
  };


  const dispatch = useDispatch();
  const birthdays = useSelector((state) => state.birthdays);

  useEffect(() => {
    if (user) {
      const userId = user.uid;
      const userBirthdaysCollectionRef = collection(
        db,
        `users/${userId}/birthday`,
      );

      fetchData(userBirthdaysCollectionRef);
    }
  }, []);

  return (
    <PaperProvider>
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
                <View style={tw`bg-white mt-8`}></View>
            <Portal>
              <Modal
                visible={visible}
                onDismiss={hideModal}
                contentContainerStyle={tw`bg-white mx-8 my-10 rounded-lg`}
              >
                <EditBirthdays />
              </Modal>
            </Portal>

            <View style={tw` mt-2`}>
              <View
                style={tw`mt-2 w-full flex-row justify-between items-center`}
              >
                <Text
                  style={tw`ml-4 text-black`}
                  variant="titleLarge"
                >
                  Add new data
                </Text>
                <FAB
                  title="EditBirthdays"
                  onPress={showModal}
                  style={tw`bg-fuchsia-700 rounded-full mr-4`}
                  size="small"
                  icon="pencil"
                  color="#FFFFFF"
                  mode="elevated"
                  testID="edit-birthdays-modal"
                />
              </View>

              <View style={tw`flex-row flex-wrap mt-6`}>
                <View style={tw`flex-grow mb-2 ml-2`}>
                  <TextInput
                    style={tw`bg-fuchsia-50 rounded-lg mx-1`}
                    textColor="#535353"
                    underlineColor="black"
                    activeUnderlineColor="#a21caf"
                    label="Day"
                    value={values.day}
                    onChangeText={handleChange("day")}
                    accessibilityLabel="Day"
                  />
                  <HelperText
                    style={tw`text-red-500 font-semibold`}
                    type="error"
                    visible={errors.day ? true : false}
                  >
                    {errors.day}
                  </HelperText>
                </View>

                <View style={tw`flex-grow mb-2`}>
                  <TextInput
                    style={tw`bg-fuchsia-50 rounded-lg mx-1`}
                    textColor="#535353"
                    underlineColor="black"
                    activeUnderlineColor="#a21caf"
                    label="Month"
                    value={values.month}
                    onChangeText={handleChange("month")}
                    accessibilityLabel="Month"
                  />
                  <HelperText
                    style={tw`text-red-500 font-semibold`}
                    type="error"
                    visible={errors.month ? true : false}
                  >
                    {errors.month}
                  </HelperText>
                </View>

                <View style={tw`flex-grow mb-2`}>
                  <TextInput
                    style={tw`bg-fuchsia-50 rounded-lg mx-1`}
                    textColor="#535353"
                    underlineColor="black"
                    activeUnderlineColor="#a21caf"
                    label="Name"
                    value={values.name}
                    onChangeText={handleChange("name")}
                    accessibilityLabel="Name"
                  />
                  <HelperText
                    style={tw`text-red-500 font-semibold`}
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
                    accessibilityLabel="FAB"
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
                    userBirthdays={birthdays}
                    userHolidays={holidays}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
        )}
      </Formik>
    </PaperProvider>
  );
};

export default YearlyCalendar;
