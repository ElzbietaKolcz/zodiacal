import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { IconButton, Text, DataTable } from "react-native-paper";
import tw from "twrnc";
import { useDispatch } from "react-redux";
import { removeEvent } from "../../features/eventSlice";
import { db, auth } from "../../../firebase";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  doc,
} from "firebase/firestore";
import { currentYear, currentMonth, currentWeek } from "../../../variables";

const TableEvent = () => {
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);

  const user = auth.currentUser;
  const userId = user?.uid;

  const fetchData = async () => {
    try {
      const userEventsCollectionRef = collection(
        db,
        `users/${userId}/${currentYear}/${currentMonth}/weeks/${currentWeek}/events`,
      );
      const q = query(userEventsCollectionRef, orderBy("day"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setEvents(data);
    } catch (error) {
      console.error("Błąd podczas pobierania danych:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (eventId) => {
    try {
      dispatch(removeEvent(eventId));
      const userEventsCollectionRef = collection(
        db,
        `users/${userId}/${currentYear}/${currentMonth}/weeks/${currentWeek}/events`,
      );
      await deleteDoc(doc(userEventsCollectionRef, eventId));
      const updatedEvents = events.filter((event) => event.id !== eventId);
      setEvents(updatedEvents);
      console.log(`Event with ID ${eventId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting event:", error.message);
    }
  };

  return (
    <View style={tw`bg-white h-full mb-8 mt-2`}>
      <Text
        style={tw`m-4 text-black`}
        variant="titleLarge"
        testID="title"
      >
        List of Events
      </Text>

      <View style={tw`flex items-center justify-center rounded-lg`}>
        <DataTable style={tw`border rounded-lg border-black w-5/6`}>
          <DataTable.Header>
            <DataTable.Title textStyle={tw`text-black text-sm font-bold`}>
              Day
            </DataTable.Title>
            <DataTable.Title textStyle={tw`text-black text-sm font-bold`}>
              Name
            </DataTable.Title>
            <DataTable.Title textStyle={tw`text-black text-sm font-bold`}>
              State
            </DataTable.Title>
            <DataTable.Title textStyle={tw`text-black text-sm font-bold`}>
              Delete
            </DataTable.Title>
          </DataTable.Header>

          {events.map((event) => {
            const formattedDay = event.day < 10 ? `0${event.day}` : event.day;
            return (
              <DataTable.Row
                key={event.id}
                style={tw`border-t border-gray-300`}
                testID="event-row"
              >
                <DataTable.Cell textStyle={tw`text-black text-center`}>
                  {formattedDay}
                </DataTable.Cell>

                <DataTable.Cell textStyle={tw`text-black text-center`}>
                  {event.name}
                </DataTable.Cell>

                <DataTable.Cell textStyle={tw`text-black text-center`}>
                  {event.state ? "done" : "undone"}
                </DataTable.Cell>

                <DataTable.Cell>
                  <IconButton
                    icon="delete"
                    iconColor="red"
                    style={tw`justify-center`}
                    onPress={() => handleDelete(event.id)}
                    testID={`delete-button-${event.id}`}
                  />
                </DataTable.Cell>
              </DataTable.Row>
            );
          })}
        </DataTable>
      </View>
    </View>
  );
};

export default TableEvent;
