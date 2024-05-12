import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { IconButton, Text, DataTable } from "react-native-paper";
import tw from "twrnc";
import { useSelector, useDispatch } from "react-redux";
import { removeEvent, setEvents } from "../features/eventSlice"; // Adjust imports
import { getISOWeek } from "date-fns";
import { db, auth } from "../../firebase";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  doc,
} from "firebase/firestore";

const TableEvent = () => { // Change component name
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]); // Change state variable name

  const user = auth.currentUser;
  const userId = user?.uid;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentWeek = getISOWeek(new Date());

  const fetchData = async () => {
    try {
      const userEventsCollectionRef = collection( // Update collection path
        db,
        `users/${userId}/${currentYear}/${currentMonth}/${currentWeek}/tasks&events/event`
      );
      const q = query(userEventsCollectionRef, orderBy("day"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      dispatch(setEvents(data)); // Update action dispatch
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const handleDeleteEvent = async (eventId) => { // Change function name
    try {
      dispatch(removeEvent(eventId));

      const userEventsCollectionRef = collection( // Update collection path
        db,
        `users/${userId}/${currentYear}/${currentMonth}/${currentWeek}/tasks&events/event`
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
      <Text style={tw`m-4 text-black`} variant="titleLarge" testID="title">
        List of Events
      </Text>

      <View style={tw`flex items-center justify-center rounded-lg`}>
        <DataTable style={tw`border rounded-lg border-gray-300 w-5/6`}>
          <DataTable.Header>
            <DataTable.Title style={tw`text-black`}>Day</DataTable.Title>
            <DataTable.Title style={tw`text-black`}>Name</DataTable.Title>
            <DataTable.Title style={tw`text-black`}>State</DataTable.Title>
            <DataTable.Title style={tw`text-black`}>Edit</DataTable.Title>
          </DataTable.Header>

          {events &&
            events.map((event) => {
              const formattedDay =
                event.day < 10 ? `0${event.day}` : event.day;

              return (
                <DataTable.Row
                  key={event.id}
                  style={tw`border-t border-gray-300`}
                  testID="event-row"
                >
                  <DataTable.Cell>
                    <Text variant="bodyLarge" style={tw`text-black`}>
                      {formattedDay}
                    </Text>
                  </DataTable.Cell>

                  <DataTable.Cell>
                    <Text variant="bodyLarge" style={tw`text-black`}>
                      {event.name}
                    </Text>
                  </DataTable.Cell>

                  <DataTable.Cell>
                    <Text variant="bodyLarge" style={tw`text-black`}>
                      {event.state ? "done" : "undone"}
                    </Text>
                  </DataTable.Cell>

                  <DataTable.Cell>
                    <IconButton
                      icon="delete"
                      onPress={() => handleDeleteEvent(event.id)} // Change function call
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