import React, { useEffect, useState } from "react";
import { View, StatusBar, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import tw from "twrnc";
import Header from "./Header";
import MonthCalendar from "./MonthCalendar";
import CustomTextInput from "./CustomTextInput";

import {
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { setBirthdays } from "../features/birthdaySlice";

const Home = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const user = auth.currentUser;

  const dispatch = useDispatch();

  const birthdays = useSelector((state) => state.birthdays);
  const userName = useSelector((state) =>
    state.user.user ? state.user.user.username : "",
  );

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
      console.error("Błąd podczas pobierania danych:", error.message);
    }
  };
  return (
    <ScrollView style={tw` bg-white h-full w-full`}>
      <StatusBar backgroundColor="white" />
      <Header userName={userName} />

      <View style={tw`mt-2`}>
        <MonthCalendar
          currentYear={currentYear}
          month={currentMonth}
          userBirthdays={birthdays}
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
          <View>
            <CustomTextInput index={0} />
            <CustomTextInput index={1} />
            <CustomTextInput index={2} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
