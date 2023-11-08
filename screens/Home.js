import React, { useState, useEffect } from "react";
import { Button, View, StatusBar, Text } from "react-native";
import Header from "./Header";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import tw from "twrnc";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app, db } from "../firebase";

const Home = () => {
  const navigation = useNavigation();
  let today = new Date().toISOString().slice(0, 10);

  const [toDo, setToDo] = useState("");
  const [userName, setUserName] = useState("");

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

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <View style={tw`bg-white h-full w-full`}>
      <StatusBar backgroundColor="white" />
      <Header />
      <Button
        title="Horoscope"
        onPress={() => navigation.navigate("Horoscope")}
      />

      <Text style={tw`text-lg mt-3`}>{userName}</Text>

      <Calendar
        style={{
          borderWidth: 1,
          borderColor: "gray",
          height: 350,
        }}
        current={today}
        onDayPress={(day) => {
          console.log("selected day", day);
        }}
        markedDates={{
          "2023-11-01": { selected: true, marked: true, selectedColor: "blue" },
          "2023-11-02": { marked: true },
          "2023-11-03": { selected: true, marked: true, selectedColor: "pink" },
        }}
      />

      <Text style={tw`text-lg mt-3`}>{toDo}</Text>
    </View>
  );
};

export default Home;
