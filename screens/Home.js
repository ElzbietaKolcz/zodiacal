import React, { useEffect, useState } from "react";
import { View, StatusBar, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import Header from "./Header";
import MonthCalendar from "./MonthCalendar";
import CustomTextInput from "./CustomTextInput";

import {
  collection,
  query,
  orderBy,
  doc,
  getDocs,
  getDoc
} from "firebase/firestore";
import { db, auth } from "../firebase";

const Home = () => {
  const navigation = useNavigation();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [userName, setUserName] = useState("");
  const [userBirthdays, setUserBirthdays] = useState([]);
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  const fetchUserBirthdays = async () => {
    try {
      if (userId) {
        console.log("Fetching user birthdays...");
        const userBirthdaysCollectionRef = collection(
          db,
          `users/${userId}/birthday`
        );
  
        const q = query(userBirthdaysCollectionRef, orderBy("day"));
        const querySnapshot = await getDocs(q);
  
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
  
        console.log("User birthdays data:", data);
        setUserBirthdays(data);
      } else {
        console.log("User ID is not available.");
      }
    } catch (error) {
      console.error("Error fetching user birthdays:", error.message);
    }
  };

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
        setUserBirthdays(userData.birthday || []);
      }
    } catch (error) {
      console.error("Błąd podczas pobierania danych użytkownika:", error);
    }
  };

  useEffect(() => {
    fetchUserBirthdays();
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    console.log("userBirthdays:", userBirthdays);
  }, [userBirthdays]);

  return (
    <ScrollView style={tw` bg-white h-full w-full`}>
      <StatusBar backgroundColor="white" />
      <Header userName={userName} />

      <View style={tw`mt-2`}>
        <MonthCalendar
          currentYear={currentYear}
          month={currentMonth}
          userBirthdays={userBirthdays}
        />
      </View>
      <View style={tw`my-2 mx-4 `}>
        <Text variant="headlineSmall" style={tw`text-black font-bold mb-4`}>
          Goals for this month
        </Text>
        <View>
          {[0, 1, 2].map((index) => (
            <CustomTextInput key={index} index={index} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
