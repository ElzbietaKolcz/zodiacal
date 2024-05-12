import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { IconButton, Text, DataTable } from "react-native-paper";
import tw from "twrnc";
import { useDispatch } from "react-redux";
import { removeTask } from "../features/taskSlice";
import { db } from "../../firebase";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  doc,
} from "firebase/firestore";
import { currentYear, currentMonth, currentWeek, user } from "../../variables"; 


const TableTask = () => {
  const dispatch = useDispatch();
  const [tasks, setTasks] = useState([]);

  const userId = user?.uid;

  const fetchData = async () => {
    try {
      const userTasksCollectionRef = collection(
        db,
        `users/${userId}/${currentYear}/${currentMonth}/${currentWeek}/tasks&events/task`
      );
      const q = query(userTasksCollectionRef, orderBy("day"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      dispatch(setTasks(data)); // Update state using setTasks
    } catch (error) {
      console.error("Błąd podczas pobierania danych:", error.message);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data on initial render
  }, [dispatch]);

  const handleDelete = async (taskId) => {
    try {
      dispatch(removeTask(taskId));

      const userTasksCollectionRef = collection(
        db,
        `users/${userId}/${currentYear}/${currentMonth}/${currentWeek}/tasks&events/task`
      );

      await deleteDoc(doc(userTasksCollectionRef, taskId));

      // Remove the deleted task from the local state
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);

      console.log(`Task with ID ${taskId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

  return (
    <View style={tw`bg-white h-full mb-8 mt-2`}>
      <Text style={tw`m-4 text-black`} variant="titleLarge" testID="title">
        List of Tasks
      </Text>

      <View style={tw`flex items-center justify-center rounded-lg`}>
        <DataTable style={tw`border rounded-lg border-gray-300 w-5/6`}>
          <DataTable.Header>
            <DataTable.Title style={tw`text-black`}>Day</DataTable.Title>
            <DataTable.Title style={tw`text-black`}>Name</DataTable.Title>
            <DataTable.Title style={tw`text-black`}>State</DataTable.Title>
            <DataTable.Title style={tw`text-black`}>Delete</DataTable.Title>
          </DataTable.Header>

          {tasks &&
            tasks.map((task) => {
              const formattedDay =
                task.day < 10 ? `0${task.day}` : task.day;

              return (
                <DataTable.Row
                  key={task.id}
                  style={tw`border-t border-gray-300`}
                  testID="task-row"
                >
                  <DataTable.Cell>
                    <Text variant="bodyLarge" style={tw`text-black`}>
                      {formattedDay}
                    </Text>
                  </DataTable.Cell>

                  <DataTable.Cell>
                    <Text variant="bodyLarge" style={tw`text-black`}>
                      {task.name}
                    </Text>
                  </DataTable.Cell>

                  <DataTable.Cell>
                    <Text variant="bodyLarge" style={tw`text-black`}>
                      {task.state ? "done" : "undone"}
                    </Text>
                  </DataTable.Cell>

                  <DataTable.Cell>
                    <IconButton
                      icon="delete"
                      onPress={() => handleDelete(task.id)}
                      testID={`delete-button-${task.id}`}
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

export default TableTask;
