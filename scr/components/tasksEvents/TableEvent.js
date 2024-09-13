import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { IconButton, Text, DataTable,DefaultTheme } from "react-native-paper";
import tw from "twrnc";
import { useDispatch, useSelector } from "react-redux";
import { addEvent, removeEvent, setEvents } from "../../features/eventSlice";
import { db, auth } from "../../../firebase";
import {
  collection,
  deleteDoc,
  onSnapshot,
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

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'black', // kolor przycisków
      text: 'black', // kolor tekstu
    },
  };
  

  const [userEvents, setUserEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  useEffect(() => {
    if (user) {
      const userEventsCollectionRef = collection(
        db,
        `users/${userId}/${currentYear}/${currentMonth}/weeks/${currentWeek}/events/`,

      );
      const q = query(userEventsCollectionRef, orderBy("day"));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        dispatch(setEvents(data));
        setUserEvents(data);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, [user, dispatch]);

  const handleDelete = async (eventId) => {
    try {
      const userEventsCollectionRef = collection(
        db,
        `users/${userId}/${currentYear}/${currentMonth}/weeks/${currentWeek}/events/`,

      );
      await deleteDoc(doc(userEventsCollectionRef, eventId));
      dispatch(removeEvent(eventId));
      console.log(`Event with ID ${eventId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting event:", error.message);
    }
  };

  return (
    <View style={tw`bg-white mb-2 mt-2`}>
      <Text style={tw`m-2 text-black`} variant="titleLarge" testID="title">
        List of Events
      </Text>

      <View style={tw`flex items-center justify-center rounded-lg`}>
        <DataTable style={tw`border rounded-lg border-black w-full`}>
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
          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(userEvents.length / itemsPerPage)}
            onPageChange={(page) => setPage(page)}
            label={`Showing ${(page * itemsPerPage) + 1}-${Math.min((page + 1) * itemsPerPage, userEvents.length)} of ${userEvents.length}`}
            numberOfItemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            showFastPaginationControls
            selectPageDropdownLabel={'Rows per page'}
            dropdownItemRippleColor="red"
            selectPageDropdownRippleColor="red"
            theme={theme}
          />
        </DataTable>
      </View>
    </View>
  );
};

export default TableEvent;
