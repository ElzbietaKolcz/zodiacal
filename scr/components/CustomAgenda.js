import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBirthdays } from "../features/birthdaySlice";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { Text, TouchableOpacity } from "react-native";
import { Agenda } from "react-native-calendars";
import tw from "twrnc";
import { currentYear, currentMonth, currentDay } from "../../variables"; 

const CustomAgenda = () => {
  const dispatch = useDispatch();
  const birthdays = useSelector((state) => state.birthdays);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const userId = user.uid;
      console.log(userId, user)
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
      console.error("Error fetching data:", error.message);
    }
  };

  const markedDates = generateMarkedDates(birthdays, currentYear, currentMonth);

  function generateMarkedDates(userBirthdays, currentYear, currentMonth) {
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
    <Agenda
      current={`${currentYear}-${currentMonth
        .toString()
        .padStart(2, "0")}-${currentDay.toString().padStart(2, "0")}`}
      items={{
        "2024-05-17": [
          { name: "Cycling" },
          { name: "Walking" },
          { name: "Running" },
        ],
        "2024-05-11": [{ name: "Writing" }],
      }}
      renderItem={(item, isFirst) => (
        <TouchableOpacity
          style={tw`bg-fuchsia-50 text-black rounded-lg m-5 flex-1 rounded-lg p-5 mr-4 mt-4`}
        >
          <Text>{item.name}</Text>
        </TouchableOpacity>
      )}
      markedDates={markedDates}
      firstDay={1}
      theme={{
        background: "purple",
        todayTextColor: "purple",
        textMonthFontWeight: "semibold",
        selectedDayBackgroundColor: "purple",
        agendaTodayColor: "purple",
      }}
    />
  );
};

export default CustomAgenda;
