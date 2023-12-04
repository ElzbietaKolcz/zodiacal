import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { FAB, TextInput, Checkbox } from "react-native-paper";
import tw from "twrnc";

import {
  collection,
  addDoc,
  getDocs,
  query,
  setDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../firebase";

import { useDispatch, useSelector } from "react-redux";
import { setGoals } from "../features/goalSlice";

const CustomTextInput = ({ initialValue, index }) => {
  const [goal, setGoal] = useState(initialValue || "");
  const [checked, setChecked] = useState(false);

  const user = auth.currentUser;
  const dispatch = useDispatch();
  const userGoals = useSelector((state) => state.goals);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  useEffect(() => {
    setGoal(initialValue || "");
  }, [initialValue]);

  const fetchData = async () => {
    try {
      if (user) {
        const userId = user.uid;
        const userGoalCollectionRef = collection(
          db,
          `users/${userId}/${currentYear}/${currentMonth}/goals`,
        );

        const q = query(userGoalCollectionRef);
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        dispatch(setGoals(data));
      }
    } catch (error) {
      console.error("Błąd podczas pobierania danych:", error.message);
    }
  };

  const addNewUserGoal = async () => {
    try {
      if (user) {
        const userId = user.uid;
        const userGoalCollectionRef = collection(
          db,
          `users/${userId}/${currentYear}/${currentMonth}/goals`,
        );

        const newUserGoalData = {
          state: false,
          name: goal,
        };

        const docRef = await addDoc(userGoalCollectionRef, newUserGoalData);

        console.log("Nowy cel dodany:", docRef.id);
        fetchData();
      }
    } catch (error) {
      console.error(
        "Błąd podczas dodawania nowego celu użytkownika:",
        error.message,
      );
    }
  };
  const updateExistingUserGoal = async () => {
    try {
      if (user) {
        const userId = user.uid;
        const userGoalCollectionRef = collection(
          db,
          `users/${userId}/${currentYear}/${currentMonth}/goals`,
        );

        const userGoalToUpdate = userGoals[0];

        await setDoc(
          doc(userGoalCollectionRef, userGoalToUpdate.id),
          { name: goal },
          { merge: true },
        );

        console.log("Cel zaktualizowany");
        fetchData();
      }
    } catch (error) {
      console.error(
        "Błąd podczas aktualizowania celu użytkownika:",
        error.message,
      );
    }
  };

  const handleInputChange = (value) => {
    setGoal(value);
  };

  const handleFABPress = async () => {
    if (goal.trim() !== "") {
      if (initialValue) {
        await updateExistingUserGoal();
      } else {
        await addNewUserGoal();
      }
    }
  };

  return (
    <View style={tw` w-full flex-row justify-between items-center`}>
      <View style={tw`rounded-lg `}>
        <Checkbox
          status={checked ? "checked" : "unchecked"}
          onPress={() => {
            setChecked(!checked);
          }}
        />
      </View>
      <View style={tw`flex-grow m-1 ml-2`}>
        <TextInput
          style={tw`bg-fuchsia-50 rounded-lg mx-1 `}
          onChangeText={handleInputChange}
          value={goal}
          activeUnderlineColor="#a21caf"
          label="Gole"
          editable={true}
        />
      </View>

      <FAB
        style={tw`bg-fuchsia-700 rounded-full m-2`}
        size="small"
        icon={initialValue ? "pencil" : "plus"}
        color="#FFFFFF"
        onPress={handleFABPress}
        mode="elevated"
      />
    </View>
  );
};

export default CustomTextInput;
