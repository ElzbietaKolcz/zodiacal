import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { TextInput, FAB, HelperText, Text } from "react-native-paper";
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

import { useDispatch, useSelector } from "react-redux";
import { addEvent } from "../../features/eventSlice";
import { currentYear, currentMonth, currentWeek, currentDay } from "../../../variables";

const AddEvent = () => {
  const [inputday, setInputDay] = useState("");

  const [inputName, setInputName] = useState("");
  const [checked, setChecked] = useState(false);
  const currentMonthEvent = useSelector((state) => state.currentMonth);

  const [eventsUser, setEvents] = useState([]);

  const dispatch = useDispatch();
  const user = auth.currentUser;

  const validationSchema = yup.object().shape({
    day: yup
      .number()
      .integer()
      .typeError("Must be a number")
      .min(1, "Must be at least 1")
      .max(31, "Must be at most 31")
      .required("Required"),
    name: yup
      .string()
      .min(2, "Too short")
      .max(200, "Too long")
      .required("Required"),
  });

  const addNewUserEvent = async (day, name) => {
    try {
      if (user) {
        const userId = user.uid;
        const userEventsCollectionRef = collection(
          db,
          `users/${userId}/${currentYear}/${currentMonth}/weeks/${currentWeek}/events/`,
        );
  
        const newUserEventData = {
          name: name,
          day: parseInt(day, 10),
          month: currentMonth, // Użyj zmiennej currentMonth jako numeru aktualnego miesiąca
          state: checked,
          tag: "event",
        };
  
        console.log("New user event data:", newUserEventData);
  
        dispatch(addEvent(newUserEventData));
  
        console.log("Saving event to the database");
        const docRef = await addDoc(userEventsCollectionRef, newUserEventData);
  
        setInputName("");
        setInputDay("");
  
        fetchData(userEventsCollectionRef);
      }
    } catch (error) {
      console.error(
        "Błąd podczas dodawania nowego zadania użytkownika:",
        error.message,
      );
    }
  };
  
  

  const fetchData = async (collectionRef) => {
    try {
      const q = query(collectionRef, orderBy("day"));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setEvents(data);
    } catch (error) {
      console.error("Błąd podczas pobierania danych:", error.message);
    }
  };

  useEffect(() => {
    if (user) {
      const userId = user.uid;
      const userEventsCollectionRef = collection(
        db,
        `users/${userId}/${currentYear}/${currentMonth}/weeks/${currentWeek}/events/`,
      );

      fetchData(userEventsCollectionRef);
    }
  }, [eventsUser]);
  return (
    <Formik
      initialValues={{ day: "", name: "" }}
      onSubmit={async (values, actions) => {
        try {
          await addNewUserEvent(values.day, values.name);
          actions.resetForm();
        } catch (error) {
          console.error(
            "Błąd podczas dodawania nowego zadania użytkownika:",
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
        <View style={tw` mt-6`}>
          <Text
            style={tw`my-2 mx-2 text-black`}
            variant="titleLarge"
            testID="title"
          >
            Add event{" "}
          </Text>
          <View style={tw`flex-row flex-wrap mt-2`}>
            <View style={tw`w-18`}>
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

            <View style={tw` w-50 mb-2`}>
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

           
            <View style={tw`my-3 mx-4`}>
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
      )}
    </Formik>
  );
};

export default AddEvent;
