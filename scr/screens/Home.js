import React, { useEffect } from "react";
import { View, StatusBar, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import tw from "twrnc";
import { useDispatch, useSelector } from "react-redux";
import { setBirthdays } from "../features/birthdaySlice";
import { setEvents } from "../features/eventSlice";
import { setTasks } from "../features/taskSlice";
import { fetchData } from "../../supabase";
import Header from "../components/Header";
import MonthCalendar from "../components/MonthCalendar";
import InputGoalMonth from "../components/InputGoalMonth";

import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase";

import { currentYear, currentMonth, currentWeek } from "../../variables";

const Home = () => {
  let dispatch = useDispatch();
  let user = auth.currentUser;
  let birthdays = useSelector((state) => state.birthdays);
  let event = useSelector((state) => state.event);
  let tasks = useSelector((state) => state.tasks);
  let holidays = useSelector((state) => state.holidays);
  useEffect(() => {
    if (user) {
      const userId = user.uid;
      const userBirthdaysCollectionRef = collection(
        db, `users/${userId}/birthday`,);
      const userEventsCollectionRef = collection(
        db, `users/${userId}/${currentYear}/${currentMonth}/weeks/${currentWeek}/events/`,);
      const userTasksCollectionRef = collection(
        db, `users/${userId}/${currentYear}/${currentMonth}/tasks&events/weeks/tasks/`,);
      fetchData();
      fetchUserTasks(userTasksCollectionRef);
      fetchBirthdays(userBirthdaysCollectionRef);
      fetchUserEvents(userEventsCollectionRef);
    }
  }, [user]);
  let fetchBirthdays = async (collectionRef) => {
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

  let fetchUserEvents = async (collectionRef) => {
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

  let fetchUserTasks = async (collectionRef) => {
    try {
      const q = query(collectionRef, orderBy("day"));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      dispatch(setTasks(data));
    } catch (error) {
      console.error("Błąd podczas pobierania danych:", error.message);
    }
  };

  return (
    <ScrollView style={tw`bg-white h-full  w-full`}>
      <View style={tw`bg-white mt-8`}></View>
      <Header />
      <View style={tw`mt-2`}>
        <MonthCalendar
          currentYear={currentYear}
          month={currentMonth}
          userBirthdays={birthdays}
          userEvents={event}
          userTasks={tasks}
          userHolidays={holidays}
        />
      </View>
      <View style={tw`my-2 mx-4`}>
        <Text
          variant="headlineSmall"
          style={tw`text-black font-bold mb-4`}
        >
          Goals for this month
        </Text>
        <View>
          <View>
            <InputGoalMonth index={0} />
            <InputGoalMonth index={1} />
            <InputGoalMonth index={2} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
