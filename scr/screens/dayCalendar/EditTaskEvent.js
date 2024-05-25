import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";

import tw from "twrnc";

import AddTask from "../../components/tasksEvents/AddTask";
import AddEvent from "../../components/tasksEvents/AddEvent";
import TableTask from "../../components/tasksEvents/TableTask";
import TableEvent from "../../components/tasksEvents/TableEvent";

const EditTaskEvent = () => {
  return (
    <ScrollView style={tw`bg-white h-full mx-7  relative place-content-center rounded-lg`}>
      <AddTask />
      <TableTask />
      <AddEvent />
      <TableEvent />
    </ScrollView>
  );
};

export default EditTaskEvent;
