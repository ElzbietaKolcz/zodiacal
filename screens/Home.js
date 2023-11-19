import React, { useState, useEffect } from "react";
import { View, StatusBar, ScrollView } from "react-native";
import {  Text } from "react-native-paper";
import tw from "twrnc";

import { useNavigation } from "@react-navigation/native";
import Header from "./Header";
import MonthCalendar from "./MonthCalendar";

import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app, db } from "../firebase";

const Home = () => {
  const navigation = useNavigation();
  const currentYear = new Date().getFullYear();
  const month = new Date().getMonth() + 1;

  const [toDo, setToDo] = useState("");
  const [userName, setUserName] = useState("");
  const [userBirthdays, setUserBirthdays] = useState([]);

  const auth = getAuth(app);
  const userId = auth.currentUser ? auth.currentUser.uid : null;

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
        const userToDo = userData.toDo;
        setToDo(userToDo);
        setUserName(userName);
      }
    } catch (error) {
      console.error("Błąd podczas pobierania danych użytkownika:", error);
    }
  };
  const fetchUserBirthdays = async () => {
    if (!userId) {
      return;
    }

    const userBirthdaysCollectionRef = collection(
      db,
      `users/${userId}/birthday`,
    );

    try {
      const querySnapshot = await getDocs(userBirthdaysCollectionRef);

      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setUserBirthdays(data);
    } catch (error) {
      console.error("Błąd podczas pobierania danych urodzin:", error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchUserBirthdays();
  }, []);

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
      <View style={tw`m-4`}>
      <Text variant="headlineSmall" style={tw`text-black font-bold`} >Goals for this month</Text>
      <Text style={tw`text-black text-lg mt-3`}>{toDo}</Text>
      </View>
    </ScrollView>
  );
};

export default Home;
