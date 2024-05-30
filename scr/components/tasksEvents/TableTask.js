import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { IconButton, Text, DataTable,DefaultTheme } from "react-native-paper";
import tw from "twrnc";
import { useDispatch } from "react-redux";
import {  removeTask, setTasks } from "../../features/taskSlice";
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
} from "../../../variables";

const TableTask = () => {
  const dispatch = useDispatch();
  const user = auth.currentUser;
  const userId = user?.uid;

  const [userTasks, setUserTasks] = useState([]);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'black', 
      text: 'black', 
    },
  };

  useEffect(() => {
    if (user) {
      const userTasksCollectionRef = collection(
        db,
        `users/${userId}/${currentYear}/${currentMonth}/${currentWeek}/tasks&events/tasks/`,
      );
      const q = query(userTasksCollectionRef, orderBy("day"));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        dispatch(setTasks(data));
        setUserTasks(data);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, [user, dispatch]);

  const handleDelete = async (taskId) => {
    try {
      const userTasksCollectionRef = collection(
        db,
        `users/${userId}/${currentYear}/${currentMonth}/${currentWeek}/tasks&events/tasks/`,
      );
      await deleteDoc(doc(userTasksCollectionRef, taskId));
      dispatch(removeTask(taskId));
      console.log(`Task with ID ${taskId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

  return (
    <View style={tw`bg-white mb-2 mt-2`}>
      <Text style={tw`my-4 text-black`} variant="titleLarge" testID="title">
        List of Tasks
      </Text>

      <View style={tw`flex items-center justify-center shrink  rounded-lg `}>
        <DataTable style={tw`border rounded-lg border-black w-full `}>
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

          {userTasks && userTasks
            .slice(page * itemsPerPage, (page + 1) * itemsPerPage)
            .map((task) => {
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

          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(userTasks.length / itemsPerPage)}
            onPageChange={(page) => setPage(page)}
            label={`Showing ${(page * itemsPerPage) + 1}-${Math.min((page + 1) * itemsPerPage, userTasks.length)} of ${userTasks.length}`}
            numberOfItemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            showFastPaginationControls
            selectPageDropdownLabel={'Rows per page'}
            theme={theme}
          />
        </DataTable>
      </View>
    </View>
  );
};

export default TableTask;
