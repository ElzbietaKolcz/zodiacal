import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { IconButton, Text, DataTable } from "react-native-paper";
import tw from "twrnc";
import { useDispatch } from "react-redux";
import { removeTask } from "../../features/taskSlice";
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

const TableTask = () => {
  const dispatch = useDispatch();
  const [tasks, setTasks] = useState([]);

  const user = auth.currentUser;
  const userId = user?.uid;

  const fetchData = async () => {
    try {
      const userTasksCollectionRef = collection(
        db,
        `users/${userId}/${currentYear}/${currentMonth}/weeks/${currentWeek}/tasks`,
      );
      const q = query(userTasksCollectionRef, orderBy("day"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTasks(data);
    } catch (error) {
      console.error("Błąd podczas pobierania danych:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (taskId) => {
    try {
      dispatch(removeTask(taskId));
      const userTasksCollectionRef = collection(
        db,
        `users/${userId}/${currentYear}/${currentMonth}/weeks/${currentWeek}/tasks`,
      );
      await deleteDoc(doc(userTasksCollectionRef, taskId));
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
      console.log(`Task with ID ${taskId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

  return (
    <View style={tw`bg-white h-full mb-8 mt-2`}>
      <Text
        style={tw`m-4 text-black`}
        variant="titleLarge"
        testID="title"
      >
        List of Tasks
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

          {tasks.map((task) => {
            const formattedDay = task.day < 10 ? `0${task.day}` : task.day;
            return (
              <DataTable.Row
                key={task.id}
                style={tw`border-t border-gray-300`}
                testID="task-row"
              >
                <DataTable.Cell textStyle={tw`text-black text-center`}>
                  {formattedDay}
                </DataTable.Cell>

                <DataTable.Cell textStyle={tw`text-black text-center`}>
                  {task.name}
                </DataTable.Cell>

                <DataTable.Cell textStyle={tw`text-black text-center`}>
                  {task.state ? "done" : "undone"}
                </DataTable.Cell>

                <DataTable.Cell>
                  <IconButton
                    icon="delete"
                    iconColor="red"
                    style={tw`justify-center`}
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