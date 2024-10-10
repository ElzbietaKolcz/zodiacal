import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { FAB, TextInput, Checkbox, Text } from "react-native-paper";
import tw from "twrnc";
import { useDispatch, useSelector } from "react-redux";
import {
  selectGoals,
  selectGoalAdded,
  setGoals,
  addGoal,
  updateGoal,
} from "../features/goalSlice";

import { db, auth } from "../../firebase";
import {
  query,
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
} from "@firebase/firestore";

import { currentYear, currentMonth } from "../../variables";

const InputGoalMonth = ({ index }) => {
  const [goal, setGoal] = useState("");
  const [checked, setChecked] = useState(false);

  const dispatch = useDispatch();
  const userGoals = useSelector(selectGoals);
  const userGoalToUpdate = userGoals.find(
    (goal) => goal && goal.index === index,
  );

  const goalAdded = useSelector(selectGoalAdded);
  const user = auth.currentUser;

  useEffect(() => {
    fetchData();
  }, []);

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

        const dataFromSnapshot = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const goalFromDatabase = dataFromSnapshot.find(
          (goal) => goal.index === index,
        );
        if (goalFromDatabase) {
          setGoal(goalFromDatabase.name);
          setChecked(goalFromDatabase.state);
        }

        dispatch(setGoals(dataFromSnapshot));
      }
    } catch (error) {
      console.error("Błąd podczas pobierania danych:", error.message);
    }
  };

  const addOrUpdateGoal = async () => {
    try {
      if (user) {
        const userId = user.uid;
        const userGoalCollectionRef = collection(
          db,
          `users/${userId}/${currentYear}/${currentMonth}/goals`,
        );
        const newGoalData = {
          state: checked,
          name: goal,
          index: index,
        };
        if (userGoalToUpdate) {
          await setDoc(
            doc(userGoalCollectionRef, userGoalToUpdate.id),
            { name: goal, state: checked },
            { merge: true },
          );
          dispatch(updateGoal({ index, name: goal }));
          const updatedGoals = userGoals.map((userGoal) =>
            userGoal.index === index ? { ...userGoal, name: goal } : userGoal,
          );
          dispatch(setGoals(updatedGoals));
        } else {
          const docRef = await addDoc(userGoalCollectionRef, newGoalData);
          dispatch(addGoal(newGoalData));
          const updatedGoals = [...userGoals, newGoalData];
          dispatch(setGoals(updatedGoals));
        }
      }
    } catch (error) {
      console.error("Error adding or updating goal:", error.message);
    }
  };

  const handleFABPress = async () => {
    await addOrUpdateGoal();
  };

  const handleInputChange = (value) => {
    setGoal(value);
  };

  const handleCheckboxPress = async () => {
    setChecked(!checked);
    if (user && userGoalToUpdate) {
      try {
        const userId = user.uid;
        const userGoalCollectionRef = collection(
          db,
          `users/${userId}/${currentYear}/${currentMonth}/goals`,
        );
        const goalDocRef = doc(userGoalCollectionRef, userGoalToUpdate.id);
        await setDoc(
          goalDocRef,
          { state: !userGoalToUpdate.state },
          { merge: true },
        );
        const updatedGoals = userGoals.map((userGoal) =>
          userGoal.index === index
            ? { ...userGoal, state: !userGoalToUpdate.state }
            : userGoal,
        );
        dispatch(setGoals(updatedGoals));
      } catch (error) {
        console.error(
          "Error updating state of the goal in Firebase:",
          error.message,
        );
      }
    }
  };

  return (
    <View style={tw`w-full flex-row justify-between items-center`}>
      <View style={tw`rounded-lg`}>
        <Checkbox
          status={checked ? "checked" : "unchecked"}
          uncheckedColor="#535353"
          color="#8D03A5"
          onPress={handleCheckboxPress}
          testID="checkbox"
        />
      </View>
      <View style={tw`flex-grow m-1 ml-2`}>
        {checked ? (
          <Text
            style={[tw` text-black rounded-lg mx-1 text-base line-through p-4`]}
          >
            {goal}
          </Text>
        ) : (
          <TextInput
            style={tw`bg-fuchsia-50 rounded-lg mx-1`}
            textColor="#535353"
            underlineColor="black"
            activeUnderlineColor="#a21caf"
            onChangeText={handleInputChange}
            value={goal}
            label="Goals"
            editable={true}
            testID="Goals"
            accessibilityLabel="Goals"
          />
        )}
      </View>
      <FAB
        style={tw`bg-fuchsia-700 rounded-full m-2`}
        size="small"
        icon={
          (!userGoalToUpdate && !goalAdded) ||
          (userGoalToUpdate && userGoalToUpdate.state)
            ? "plus"
            : "pencil"
        }
        color="#FFFFFF"
        onPress={handleFABPress}
        mode="elevated"
        disabled={checked || (userGoalToUpdate && userGoalToUpdate.state)}
        accessibilityLabel="FAB"
      />
    </View>
  );
};

export default InputGoalMonth;
