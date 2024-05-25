// Home.js

import React, { useEffect, useState } from "react";
import { View, StatusBar, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import tw from "twrnc";
import Header from "../components/Header";
import MonthCalendar from "../components/MonthCalendar";
import InputGoalMonth from "../components/InputGoalMonth";

import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { setBirthdays } from "../features/birthdaySlice";
import { setEvents } from "../features/eventSlice";
import { setTasks } from "../features/taskSlice"; // Importujemy akcję setTasks

import { currentYear, currentMonth, currentWeek } from "../../variables";

const Home = () => {
  const dispatch = useDispatch();
  const user = auth.currentUser;

  const birthdays = useSelector((state) => state.birthdays);
  const event = useSelector((state) => state.event);
  const tasks = useSelector((state) => state.tasks); // Pobieramy tasks z Reduxa
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
      const userEventsCollectionRef = collection(
        db,
        `users/${userId}/${currentYear}/${currentMonth}/${currentWeek}/tasks&events/events/`
      );
      const userTasksCollectionRef = collection(
        db,
        `users/${userId}/${currentYear}/${currentMonth}/${currentWeek}/tasks&events/tasks/`
      );
      
      fetchUserTasks(userTasksCollectionRef); // Pobieramy wydarzenia użytkownika
      fetchData(userBirthdaysCollectionRef);
      fetchUserEvents(userEventsCollectionRef); // Pobieramy wydarzenia użytkownika
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

  const fetchUserEvents = async (collectionRef) => {
    try {
      const q = query(collectionRef, orderBy("day"));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      dispatch(setEvents(data));
    } catch (error) {
      console.error("Błąd podczas pobierania danych:", error.message);
    }
  };

  const fetchUserTasks = async (collectionRef) => {
    try {
      const q = query(collectionRef, orderBy("day"));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      dispatch(setTasks(data)); // Aktualizujemy stan zadań w Reduxie
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
          userEvents={event}
          userTasks={tasks} // Przekazujemy tasks do komponentu MonthCalendar
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
          {/* <View>
            <InputGoalMonth index={0} />
            <InputGoalMonth index={1} />
            <InputGoalMonth index={2} />
          </View> */}
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
