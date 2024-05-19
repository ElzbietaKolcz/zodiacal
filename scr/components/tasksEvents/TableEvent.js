import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { IconButton, Text, DataTable } from "react-native-paper";
import tw from "twrnc";
import { useDispatch, useSelector } from "react-redux";

import { addEvent, removeEvent, setEvents } from "../../features/eventSlice";
import { db, auth } from "../../../firebase";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  doc,
} from "firebase/firestore";
import {
  currentYear,
  currentMonth,
  currentWeek,
  currentDay,
} from "../../../variables";

const TableEvent = () => {
  const dispatch = useDispatch();
  const user = auth.currentUser;
  const userId = user?.uid;

  const [userEvents, setUserEvents] = useState([]);

  const fetchData = async () => {
    try {
      const userEventsCollectionRef = collection(
        db,
        `users/${userId}/${currentYear}/${currentMonth}/${currentWeek}/events/${currentDay}`,
      );
      const q = query(userEventsCollectionRef, orderBy("day"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log("Pobrane dane:", data);
      dispatch(setEvents(data));
      setUserEvents(data); // ustawiamy dane lokalnie
    } catch (error) {
      console.error("Błąd podczas pobierania danych:", error.message);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const userEventsCollectionRef = collection(
        db,
        `users/${userId}/${currentYear}/${currentMonth}/${currentWeek}/events/${currentDay}`,
      );
      await deleteDoc(doc(userEventsCollectionRef, eventId));
      dispatch(removeEvent(eventId));
      console.log(`Event with ID ${eventId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting event:", error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, []);

  return (
    <View style={tw`bg-white h-full mb-8 mt-2`}>
      <Text style={tw`m-4 text-black`} variant="titleLarge" testID="title">
        List of Events
      </Text>

      <View style={tw`flex items-center justify-center rounded-lg`}>
        <DataTable style={tw`border rounded-lg border-black w-5/6`}>
          <DataTable.Header>
            <DataTable.Title style={tw`flex-1`}>
              <Text style={tw`text-black text-sm font-bold`}>Day</Text>
            </DataTable.Title>
            <DataTable.Title style={tw`flex-2`}>
              <Text style={tw`text-black text-sm font-bold`}>Name</Text>
            </DataTable.Title>
            <DataTable.Title style={tw`flex-1`}>
              <Text style={tw`text-black text-sm font-bold`}>State</Text>
            </DataTable.Title>
            <DataTable.Title style={tw`flex-1`}>
              <Text style={tw`text-black text-sm font-bold`}>Delete</Text>
            </DataTable.Title>
          </DataTable.Header>

          {userEvents && userEvents.map((event) => {
            const formattedDay =
              event.day < 10 ? `0${event.day}` : event.day;
            const eventName = event.name ? event.name : "";
            console.log("Events:", event.name);
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
                  {eventName}
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
