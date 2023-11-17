import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { Calendar } from "react-native-calendars";
import tw from "twrnc";
import { TextInput, FAB, Text, PaperProvider } from "react-native-paper";

const YearlyCalendar = () => {
  const currentYear = new Date().getFullYear();

  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  const [userBirthdays, setUserBirthdaysData] = useState([]);
  const [inputDay, setInputDay] = useState("");
  const [inputMonth, setInputMonth] = useState("");
  const [inputName, setInputName] = useState("");

  const fetchData = async (collectionRef, setData) => {
    try {
      const q = query(collectionRef, orderBy("day"));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setData(data);
    } catch (error) {
      console.error("Błąd podczas pobierania danych:", error.message);
    }
  };

  const addNewUserBirthday = async () => {
    try {
      if (user) {
        const userId = user.uid;
        const userBirthdaysCollectionRef = collection(
          db,
          `users/${userId}/birthday`,
        );

        const newUserBirthdayData = {
          name: inputName,
          day: parseInt(inputDay, 10),
          month: parseInt(inputMonth, 10),
        };

        const docRef = await addDoc(
          userBirthdaysCollectionRef,
          newUserBirthdayData,
        );

        fetchData(userBirthdaysCollectionRef, setUserBirthdaysData);
        setInputName("");
        setInputDay("");
        setInputMonth("");
      }
    } catch (error) {
      console.error(
        "Błąd podczas dodawania nowych urodzin użytkownika:",
        error.message,
      );
    }
  };

  useEffect(() => {
    if (user) {
      const userId = user.uid;
      const userBirthdaysCollectionRef = collection(
        db,
        `users/${userId}/birthday`,
      );

      fetchData(userBirthdaysCollectionRef, setUserBirthdaysData);
    }
  }, [user]);

  function generateMarkedDates(userBirthdays, currentYear) {
    const markedDates = {};

    userBirthdays.forEach((birthday, index) => {
      const formattedDay = birthday.day.toString().padStart(2, "0");
      const formattedMonth = birthday.month.toString().padStart(2, "0");
      const dateKey = `${currentYear}-${formattedMonth}-${formattedDay}`;

      markedDates[dateKey] = {
        selected: true,
        selectedColor: "purple",
      };
    });

    return markedDates;
  }

  return (
    <ScrollView style={tw` bg-white h-full w-full`}>
      <View style={tw` mt-2`}>
        <Text
          style={tw` mt-6 ml-5 text-black`}
          variant="titleLarge"
        >
          Add new data
        </Text>
        <View style={tw`mx-3 my-6 flex-row`}>
          <TextInput
            style={tw`bg-fuchsia-50 rounded-lg mx-1`}
            label="Day"
            value={inputDay}
            onChangeText={(text) => setInputDay(text)}
            activeUnderlineColor="#a21caf"
          />

          <TextInput
            style={tw`bg-fuchsia-50 rounded-lg mx-1`}
            label="Month"
            value={inputMonth}
            onChangeText={(text) => setInputMonth(text)}
            activeUnderlineColor="#a21caf"
          />

          <TextInput
            style={tw`bg-fuchsia-50 rounded-lg mx-1 w-32`}
            label="Name"
            value={inputName}
            onChangeText={(text) => setInputName(text)}
            activeUnderlineColor="#a21caf"
          />
          <FAB
            style={tw`bg-fuchsia-700 rounded-full m-2 mx-4 absolute right-1 bottom-0`}
            size="small"
            icon="plus"
            color="#FFFFFF"
            onPress={addNewUserBirthday}
            mode="elevated"
          />
        </View>
      </View>
      <View style={tw`mt-4`}>
        <Calendar
          style={tw`border-4 rounded border-fuchsia-100`}
          current={`${currentYear}-01-01`}
          markedDates={generateMarkedDates(userBirthdays, currentYear)}
          hideExtraDays={true}
          firstDay={1}
          hideArrows={true}
        />
        <View style={tw`my-4 flex-row flex-wrap`}>
          {userBirthdays.map(function (birthday) {
            if (birthday.month === 1) {
              return (
                <Text
                  variant="bodyLarge"
                  style={tw`ml-7 text-black `}
                  key={birthday.id}
                >
                  {birthday.day} {birthday.name}
                </Text>
              );
            }
            return null;
          })}
        </View>

        <Calendar
          style={tw`border-4 rounded border-fuchsia-100`}
          current={`${currentYear}-02-01`}
          markedDates={generateMarkedDates(userBirthdays, currentYear)}
          hideExtraDays={true}
          firstDay={1}
          hideArrows={true}
        />
        <View style={tw`my-4 flex-row flex-wrap`}>
          {userBirthdays.map(function (birthday) {
            if (birthday.month === 2) {
              return (
                <Text
                  variant="bodyLarge"
                  style={tw`ml-7 text-black `}
                  key={birthday.id}
                >
                  {birthday.day} {birthday.name}
                </Text>
              );
            }
            return null;
          })}
        </View>
        <Calendar
          style={tw`border-4 rounded border-fuchsia-100`}
          current={`${currentYear}-03-01`}
          markedDates={generateMarkedDates(userBirthdays, currentYear)}
          hideExtraDays={true}
          firstDay={1}
          hideArrows={true}
        />
        <View style={tw`my-4 flex-row flex-wrap`}>
          {userBirthdays.map(function (birthday) {
            if (birthday.month === 3) {
              return (
                <Text
                  variant="bodyLarge"
                  style={tw`ml-7 text-black `}
                  key={birthday.id}
                >
                  {birthday.day} {birthday.name}
                </Text>
              );
            }
            return null;
          })}
        </View>
        <Calendar
          style={tw`border-4 rounded border-fuchsia-100`}
          current={`${currentYear}-04-01`}
          markedDates={generateMarkedDates(userBirthdays, currentYear)}
          hideExtraDays={true}
          firstDay={1}
          hideArrows={true}
        />
        <View style={tw`my-4 flex-row flex-wrap`}>
          {userBirthdays.map(function (birthday) {
            if (birthday.month === 4) {
              return (
                <Text
                  variant="bodyLarge"
                  style={tw`ml-7 text-black `}
                  key={birthday.id}
                >
                  {birthday.day} {birthday.name}
                </Text>
              );
            }
            return null;
          })}
        </View>
        <Calendar
          style={tw`border-4 rounded border-fuchsia-100`}
          current={`${currentYear}-05-01`}
          markedDates={generateMarkedDates(userBirthdays, currentYear)}
          hideExtraDays={true}
          firstDay={1}
          hideArrows={true}
        />
        <View style={tw`my-4 flex-row flex-wrap`}>
          {userBirthdays.map(function (birthday) {
            if (birthday.month === 5) {
              return (
                <Text
                  variant="bodyLarge"
                  style={tw`ml-7 text-black `}
                  key={birthday.id}
                >
                  {birthday.day} {birthday.name}
                </Text>
              );
            }
            return null;
          })}
        </View>
        <Calendar
          style={tw`border-4 rounded border-fuchsia-100`}
          current={`${currentYear}-06-01`}
          markedDates={generateMarkedDates(userBirthdays, currentYear)}
          hideExtraDays={true}
          firstDay={1}
          hideArrows={true}
        />
        <View style={tw`my-4 flex-row flex-wrap`}>
          {userBirthdays.map(function (birthday) {
            if (birthday.month === 6) {
              return (
                <Text
                  variant="bodyLarge"
                  style={tw`ml-7 text-black `}
                  key={birthday.id}
                >
                  {birthday.day} {birthday.name}
                </Text>
              );
            }
            return null;
          })}
        </View>
        <Calendar
          style={tw`border-4 rounded border-fuchsia-100`}
          current={`${currentYear}-07-01`}
          markedDates={generateMarkedDates(userBirthdays, currentYear)}
          hideExtraDays={true}
          firstDay={1}
          hideArrows={true}
        />
        <View style={tw`my-4 flex-row flex-wrap`}>
          {userBirthdays.map(function (birthday) {
            if (birthday.month === 7) {
              return (
                <Text
                  variant="bodyLarge"
                  style={tw`ml-7 text-black `}
                  key={birthday.id}
                >
                  {birthday.day} {birthday.name}
                </Text>
              );
            }
            return null;
          })}
        </View>
        <Calendar
          style={tw`border-4 rounded border-fuchsia-100`}
          current={`${currentYear}-08-01`}
          markedDates={generateMarkedDates(userBirthdays, currentYear)}
          hideExtraDays={true}
          firstDay={1}
          hideArrows={true}
        />
        <View style={tw`my-4 flex-row flex-wrap`}>
          {userBirthdays.map(function (birthday) {
            if (birthday.month === 8) {
              return (
                <Text
                  variant="bodyLarge"
                  style={tw`ml-7 text-black `}
                  key={birthday.id}
                >
                  {birthday.day} {birthday.name}
                </Text>
              );
            }
            return null;
          })}
        </View>
        <Calendar
          style={tw`border-4 rounded border-fuchsia-100`}
          current={`${currentYear}-09-01`}
          markedDates={generateMarkedDates(userBirthdays, currentYear)}
          hideExtraDays={true}
          firstDay={1}
          hideArrows={true}
        />
        <View style={tw`my-4 flex-row flex-wrap`}>
          {userBirthdays.map(function (birthday) {
            if (birthday.month === 9) {
              return (
                <Text
                  variant="bodyLarge"
                  style={tw`ml-7 text-black `}
                  key={birthday.id}
                >
                  {birthday.day} {birthday.name}
                </Text>
              );
            }
            return null;
          })}
        </View>
        <Calendar
          style={tw`border-4 rounded border-fuchsia-100`}
          current={`${currentYear}-10-01`}
          markedDates={generateMarkedDates(userBirthdays, currentYear)}
          hideExtraDays={true}
          firstDay={1}
          hideArrows={true}
        />
        <View style={tw`my-4 flex-row flex-wrap`}>
          {userBirthdays.map(function (birthday) {
            if (birthday.month === 10) {
              return (
                <Text
                  variant="bodyLarge"
                  style={tw`ml-7 text-black `}
                  key={birthday.id}
                >
                  {birthday.day} {birthday.name}
                </Text>
              );
            }
            return null;
          })}
        </View>
        <Calendar
          style={tw`border-4 rounded border-fuchsia-100`}
          current={`${currentYear}-11-01`}
          markedDates={generateMarkedDates(userBirthdays, currentYear)}
          hideExtraDays={true}
          firstDay={1}
          hideArrows={true}
        />
        <View style={tw`my-4 flex-row flex-wrap`}>
          {userBirthdays.map(function (birthday) {
            if (birthday.month === 11) {
              return (
                <Text
                  variant="bodyLarge"
                  style={tw`ml-7 text-black `}
                  key={birthday.id}
                >
                  {birthday.day} {birthday.name}
                </Text>
              );
            }
            return null;
          })}
        </View>
        <Calendar
          style={tw`border-4 rounded border-fuchsia-100`}
          current={`${currentYear}-12-01`}
          markedDates={generateMarkedDates(userBirthdays, currentYear)}
          hideExtraDays={true}
          firstDay={1}
          hideArrows={true}
        />
        <View style={tw`my-4 flex-row flex-wrap`}>
          {userBirthdays.map(function (birthday) {
            if (birthday.month === 12) {
              return (
                <Text
                  variant="bodyLarge"
                  style={tw`ml-7 text-black `}
                  key={birthday.id}
                >
                  {birthday.day} {birthday.name}
                </Text>
              );
            }
            return null;
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default YearlyCalendar;
