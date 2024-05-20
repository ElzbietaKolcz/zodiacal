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
import { addTask } from "../../features/taskSlice";
import { currentYear, currentMonth, currentWeek, currentDay } from "../../../variables";

const AddTask = () => {
  const [inputday, setInputDay] = useState("");

  const [inputName, setInputName] = useState("");
  const [checked, setChecked] = useState(false);
  const currentMonthTask = useSelector((state) => state.currentMonth);

  const [tasksUser, setTasks] = useState([]);

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

  const addNewUserTask = async (day, name) => {
    try {
      if (user) {
        const userId = user.uid;
        const userTasksCollectionRef = collection(
          db,
          `users/${userId}/${currentYear}/${currentMonth}/${currentWeek}/tasks&events/tasks/`,
        );
  
        const newUserTaskData = {
          name: name,
          day: parseInt(day, 10),
          state: checked,
          tag: "task",
        };
  
        if (currentMonthTask) {
          newUserTaskData.month = currentMonthTask;
        }
  
        // Dispatch the addTask action
        dispatch(addTask(newUserTaskData));
  
        // Save to the database
        const docRef = await addDoc(userTasksCollectionRef, newUserTaskData);
  
        setInputName("");
        setInputDay("");
  
        // No need to update local state here
  
        fetchData(userTasksCollectionRef);
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

      setTasks(data);
    } catch (error) {
      console.error("Błąd podczas pobierania danych:", error.message);
    }
  };

  useEffect(() => {
    if (user) {
      const userId = user.uid;
      const userTasksCollectionRef = collection(
        db,
        `users/${userId}/${currentYear}/${currentMonth}/${currentWeek}/tasks&events/tasks/`,
      );

      fetchData(userTasksCollectionRef);
    }
  }, [tasksUser]);
  return (
    <Formik
      initialValues={{ day: "", name: "" }}
      onSubmit={async (values, actions) => {
        try {
          await addNewUserTask(values.day, values.name);
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
        <View style={tw` mt-2`}>
          <Text
            style={tw`my-2 mx-4 text-black`}
            variant="titleLarge"
            testID="title"
          >
            Add task{" "}
          </Text>
          <View style={tw`flex-row flex-wrap mt-2`}>
            <View style={tw`w-22 mb-2 ml-2`}>
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

            <View style={tw` w-55 mb-2`}>
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
      )}
    </Formik>
  );
};

export default AddTask;
