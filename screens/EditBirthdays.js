import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { IconButton, Text, DataTable } from "react-native-paper";
import tw from "twrnc";

import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth,} from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { removeBirthday } from "../features/birthdaySlice";

const EditBirthdays = () => {
  const dispatch = useDispatch();
  const userBirthdays = useSelector((state) => state.birthdays);
  const [userBirthday, setUserBirthdaysData] = useState([]);

  const user = auth.currentUser;

  const fetchData = async (collectionRef, setData) => {
    try {
      const q = query(collectionRef, orderBy("month"), orderBy("day"));
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

  const handleDelete = async (birthdayId) => {
    try {
      dispatch(removeBirthday(birthdayId));

      const userBirthdaysCollectionRef = collection(
        db,
        `users/${user.uid}/birthday`,
      );

      await deleteDoc(doc(userBirthdaysCollectionRef, birthdayId));
      fetchData(userBirthdaysCollectionRef, setUserBirthdaysData);

      console.log(`Birthday with ID ${birthdayId} deleted successfully.`);
    } catch (error) {
      console.error("Błąd podczas usuwania urodzin:", error.message);
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
  }, []);

  return (
    <ScrollView style={tw`bg-white h-full mb-8 mt-2`}>
      <Text
        style={tw`m-4 text-black`}
        variant="titleLarge"
        testID="title"
      >
        List of birthday
      </Text>

      <View style={tw`flex items-center justify-center rounded-lg`}>
        <DataTable style={tw`border rounded-lg border-gray-300 w-5/6`}>
          <DataTable.Header>
            <DataTable.Title style={tw`text-black`}>Day</DataTable.Title>
            <DataTable.Title style={tw`text-black`}>Month</DataTable.Title>
            <DataTable.Title style={tw`text-black`}>Name</DataTable.Title>
            <DataTable.Title style={tw`text-black`}>Delete</DataTable.Title>
          </DataTable.Header>

          {userBirthdays && userBirthdays.map((birthday)  => {
            const formattedDay =
              birthday.day < 10 ? `0${birthday.day}` : birthday.day;
            const formattedMonth =
              birthday.month < 10 ? `0${birthday.month}` : birthday.month;

            return (
              <DataTable.Row
                key={birthday.id}
                style={tw`border-t border-gray-300`}
                testID="birthday-row"
              >
                <DataTable.Cell>
                  <Text
                    variant="bodyLarge"
                    style={tw`text-black`}
                  >
                    {formattedDay}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text
                    variant="bodyLarge"
                    style={tw`text-black`}
                  >
                    {formattedMonth}
                  </Text>
                </DataTable.Cell>

                <DataTable.Cell>
                  <Text
                    variant="bodyLarge"
                    style={tw`text-black`}
                  >
                    {birthday.name}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <IconButton
                    icon="delete"
                    onPress={() => handleDelete(birthday.id)}
                    testID={`delete-button-${birthday.id}`}
                  />
                </DataTable.Cell>
              </DataTable.Row>
            );
          })}
        </DataTable>
      </View>
    </ScrollView>
  );
};

export default EditBirthdays;
