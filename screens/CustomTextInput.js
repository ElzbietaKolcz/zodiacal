import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { FAB, TextInput, Checkbox } from "react-native-paper";
import tw from "twrnc";
import { useDispatch, useSelector } from "react-redux";
import {
  selectGoals,
  selectGoalAdded,
  setGoals,
  addGoal,
  updateGoal,
  toggleGoalState,
} from "../features/goalSlice";

import {
  query,
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
} from "@firebase/firestore";

import { db, auth } from "../firebase";

const CustomTextInput = ({ initialValue, index }) => {
  const [goal, setGoal] = useState("");
  const [checked, setChecked] = useState(false);

  const dispatch = useDispatch();
  const userGoals = useSelector(selectGoals);
  const userGoalToUpdate = userGoals[index];
  const goalAdded = useSelector(selectGoalAdded);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const user = auth.currentUser;

  useEffect(() => {
    console.log("CustomTextInput useEffect triggered");
    if (initialValue) {
      setGoal(initialValue);
    } else {
      fetchData();
    }
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

        console.log("Fetched data:", data);

        const goalFromDatabase = data.find((goal) => goal.index === index);
        if (goalFromDatabase) {
          setGoal(goalFromDatabase.name);
        }

        dispatch(setGoals(data));
        console.log("Redux Store state after setGoals:", data);
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
          index: index,
        };

        const docRef = await addDoc(userGoalCollectionRef, newUserGoalData);

        console.log("Nowy cel dodany:", docRef.id);
        dispatch(addGoal(newUserGoalData));
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
      if (user && userGoalToUpdate) {
        const userId = user.uid;
        const userGoalCollectionRef = collection(
          db,
          `users/${userId}/${currentYear}/${currentMonth}/goals`,
        );

        await setDoc(
          doc(userGoalCollectionRef, userGoalToUpdate.id),
          { name: goal, index: index },
          { merge: true },
        );

        console.log("Cel zaktualizowany");
        dispatch(updateGoal({ index, name: goal }));
      }
    } catch (error) {
      console.error(
        "Błąd podczas aktualizowania celu użytkownika:",
        error.message,
      );
    }
  };
  const handleFABPress = async () => {
    if (userGoalToUpdate) {
      await updateExistingUserGoal();
    } else {
      await addNewUserGoal();
    }
  };

  const handleInputChange = (value) => {
    setGoal(value);

    if (!goalAdded && value.trim() !== "") {
      const updatedGoal = userGoals.find(
        (userGoal) => userGoal.index === index,
      );
      if (updatedGoal) {
        dispatch(updateGoal({ index, name: value }));
      }
    }
  };

  const handleCheckboxPress = async () => {
    setChecked(!checked);
    if (user && userGoalToUpdate) {
      const userId = user.uid;
      const userGoalCollectionRef = collection(
        db,
        `users/${userId}/${currentYear}/${currentMonth}/goals`,
      );

      await setDoc(
        doc(userGoalCollectionRef, userGoalToUpdate.id),
        { state: !checked },
        { merge: true },
      );

      console.log("Stan celu zaktualizowany");

      // Aktualizacja stanu w Redux za pomocą akcji toggleGoalState
      dispatch(toggleGoalState(index)); // Upewnij się, że index jest poprawny
    }
  };

  return (
    <View style={tw`w-full flex-row justify-between items-center`}>
      <View style={tw`rounded-lg`}>
        <Checkbox
          status={checked ? "checked" : "unchecked"}
          onPress={handleCheckboxPress} // Zmiana onPress na funkcję obsługującą checkboxa
        />
      </View>
      <View style={tw`flex-grow m-1 ml-2`}>
      <TextInput
          style={[
            tw`bg-fuchsia-50 rounded-lg mx-1`,
            checked && tw`line-through`, // Dodaj styl 'line-through' jeśli checked === true
          ]}
          onChangeText={handleInputChange}
          value={goal}
          activeUnderlineColor="#a21caf"
          label="Goals"
          editable={true}
        />
      </View>

      <FAB
        style={tw`bg-fuchsia-700 rounded-full m-2`}
        size="small"
        icon={goalAdded ? "pencil" : "plus"}
        color="#FFFFFF"
        onPress={handleFABPress}
        mode="elevated"
      />
    </View>
  );
};

export default CustomTextInput;
