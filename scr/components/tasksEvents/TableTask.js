import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { IconButton, Text, DataTable } from "react-native-paper";
import tw from "twrnc";
import { useDispatch, useSelector } from "react-redux";
import { addTask, removeTask, setTasks } from "../../features/taskSlice";
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

const TableTask = () => {
  const dispatch = useDispatch();
  const user = auth.currentUser;
  const userId = user?.uid;

  const [userTasks, setUserTasks] = useState([]);

  const fetchData = async () => {
    try {
      const userTasksCollectionRef = collection(
        db,
        `users/${userId}/${currentYear}/${currentMonth}/${currentWeek}/tasks/${currentDay}`,
      );
      const q = query(userTasksCollectionRef, orderBy("day"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      dispatch(setTasks(data));
      setUserTasks(data);
    } catch (error) {
      console.error("Błąd podczas pobierania danych:", error.message);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const userTasksCollectionRef = collection(
        db,
        `users/${userId}/${currentYear}/${currentMonth}/${currentWeek}/tasks/${currentDay}`,
      );
      await deleteDoc(doc(userTasksCollectionRef, taskId));
      dispatch(removeTask(taskId));
      setUserTasks(userTasks.filter(task => task.id !== taskId)); // Aktualizujemy stan lokalny usuwając zadanie
      console.log(`Task with ID ${taskId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting task:", error.message);
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
        List of Tasks
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

          {userTasks && userTasks.map((task) => {
            const formattedDay =
              task.day < 10 ? `0${task.day}` : task.day;
            const taskName = task.name ? task.name : "";
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
                  {taskName}
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
