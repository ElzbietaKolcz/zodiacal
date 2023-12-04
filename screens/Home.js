import React, { useEffect, useState } from "react";
import { View, StatusBar, ScrollView, CheckBox } from "react-native";
import { Text } from "react-native-paper";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "./Header";
import MonthCalendar from "./MonthCalendar";
import CustomTextInput from "./CustomTextInput";

import { useSelector, useDispatch } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { setBirthdays } from "../features/birthdaySlice";

const Home = () => {
  const navigation = useNavigation();
  const currentYear = new Date().getFullYear();
  const month = new Date().getMonth() + 1;

  const [userName, setUserName] = useState("");

  const goals = useSelector((state) => state.goals);

  const userId = auth.currentUser ? auth.currentUser.uid : null;

  const userBirthdays = useSelector((state) => state.birthdays);
  const dispatch = useDispatch();

  const fetchUserData = async () => {
    if (!userId) {
      return;
    }

    const userDocRef = doc(db, "users", userId);

    try {
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const userName = userData.username;
        setUserName(userName);
      }
    } catch (error) {
      console.error("Błąd podczas pobierania danych użytkownika:", error);
    }
  };

  const saveBirthdaysToStorage = async (birthdays) => {
    try {
      await AsyncStorage.setItem("birthdays", JSON.stringify(birthdays));
    } catch (error) {
      console.error("Błąd podczas zapisywania urodzin w AsyncStorage:", error);
    }
  };

  const getBirthdaysFromStorage = async () => {
    try {
      const birthdays = await AsyncStorage.getItem("birthdays");
      if (birthdays !== null) {
        dispatch(setBirthdays(JSON.parse(birthdays)));
      }
    } catch (error) {
      console.error("Błąd podczas odczytywania urodzin z AsyncStorage:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    getBirthdaysFromStorage();
  }, []);

  useEffect(() => {
    saveBirthdaysToStorage(userBirthdays);
  }, [userBirthdays]);

  return (
    <ScrollView style={tw` bg-white h-full w-full`}>
      <StatusBar backgroundColor="white" />
      <Header userName={userName} />

      <View style={tw`mt-2`}>
        <MonthCalendar
          currentYear={currentYear}
          month={month}
          userBirthdays={userBirthdays}
        />
      </View>
      <View style={tw`my-2 mx-4 `}>
        <Text
          variant="headlineSmall"
          style={tw`text-black font-bold mb-4`}
        >
          Goals for this month
        </Text>
        <View>
          <CustomTextInput
            initialValue={goals[0]?.name || ""}
            index={0}
          />

          <CustomTextInput
            initialValue={goals[1]?.name || ""}
            index={1}
          />

          <CustomTextInput
            initialValue={goals[2]?.name || ""}
            index={2}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
