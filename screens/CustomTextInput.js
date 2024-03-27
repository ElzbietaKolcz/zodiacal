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

import { db, auth } from "../firebase";
import {
  query,
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
} from "@firebase/firestore";

const CustomTextInput = ({ index }) => {
  const [goal, setGoal] = useState("");
  const [checked, setChecked] = useState(false);

  const dispatch = useDispatch();
  const userGoals = useSelector(selectGoals);
  const userGoalToUpdate = userGoals.find(goal => goal && goal.index === index);

  const goalAdded = useSelector(selectGoalAdded);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
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

        const dataFromSnapshot = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));

        const goalFromDatabase = dataFromSnapshot.find(
          goal => goal.index === index
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
            { merge: true }
          );
          dispatch(updateGoal({ index, name: goal }));
        } else {
          const docRef = await addDoc(userGoalCollectionRef, newGoalData);
          console.log("New goal added:", docRef.id);
          dispatch(addGoal(newGoalData));
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
  
        await setDoc(goalDocRef, { state: !userGoalToUpdate.state }, { merge: true });
        console.log("State of the goal updated in Firebase");
      } catch (error) {
        console.error("Error updating state of the goal in Firebase:", error.message);
      }
    }
  };
  return (
    <View style={tw`w-full flex-row justify-between items-center`}>
      <View style={tw`rounded-lg`}>
        <Checkbox
          status={checked ? "checked" : "unchecked"}
          onPress={handleCheckboxPress}
        />
      </View>
      <View style={tw`flex-grow m-1 ml-2`}>
        {checked ? (
          <Text
            style={[
              tw`bg-fuchsia-50 text-black rounded-lg mx-1 text-base line-through p-4`,
            ]}
          >
            {goal}
          </Text>
        ) : (
          <TextInput
            style={tw`bg-fuchsia-50 text-black rounded-lg mx-1`}
            onChangeText={handleInputChange}
            value={goal}
            activeUnderlineColor="#a21caf"
            label="Goals"
            editable={true}
          />
        )}
      </View>
      <FAB
        style={tw`bg-fuchsia-700 rounded-full m-2`}
        size="small"
        icon={userGoalToUpdate && userGoalToUpdate.state ? "pencil" : "plus"}
        color="#FFFFFF"
        onPress={handleFABPress}
        mode="elevated"
        disabled={userGoalToUpdate && userGoalToUpdate.state}
      />
    </View>
  );
};

export default CustomTextInput;
