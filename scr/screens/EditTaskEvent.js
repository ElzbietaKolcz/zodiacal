import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";

import tw from "twrnc";


import AddTask from './../components/AddTask';
import AddEvent from './../components/AddEvent';
import TableTask from './../components/TableTask';
import TableEvent from "../components/TableEvent";

const EditTaskEvent = () => {

  return (
    <ScrollView style={tw`bg-white h-full mb-8 mt-2`}>
     <AddTask />
      <TableTask />
      <AddEvent />
      <TableEvent />
    </ScrollView>
  );
};

export default EditTaskEvent;
