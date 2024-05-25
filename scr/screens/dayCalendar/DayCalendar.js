import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";

import tw from "twrnc";
import InputGoalWeek from "../../components/InputGoalWeek";
import CustomAgenda from "../../components/CustomAgenda";
import EditTaskEvent from "./EditTaskEvent";

import { FAB, Text, Modal, Portal, PaperProvider } from "react-native-paper";

const DayCalendar = () => {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);


  return (
    <ScrollView style={tw`bg-white w-full flex-1`}>
      <PaperProvider style={tw`h-full w-full flex-1`}>
        <View style={tw`h-full`}>
          <CustomAgenda />

          <Portal >
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={tw`bg-white mx-6 absolute w-11/12 top-10 rounded-lg `}
            >
              <EditTaskEvent />
            </Modal>
          </Portal>
          <View style={tw`mt-6`}>
            <View style={tw`mt-2 w-full flex-row justify-between items-center`}>
              <Text style={tw`ml-4 text-black`} variant="titleLarge">
                Add new task / event
              </Text>
              <FAB
                title="EditTaskEvent"
                onPress={showModal}
                style={tw`bg-fuchsia-700 rounded-full mr-4`}
                size="small"
                icon="plus"
                color="#FFFFFF"
                mode="elevated"
                testID="edit-birthdays-modal"
              />
            </View>
          </View>
          <View style={tw`my-2 mx-4 content-end`}>
            <Text variant="headlineSmall" style={tw`text-black font-bold mt-6 text-2xl`}>
              Goals for this weekend
            </Text>

            {/* <View>
              <View>
                <InputGoalWeek index={0} />
                <InputGoalWeek index={1} />
                <InputGoalWeek index={2} />
              </View>
            </View> */}
          </View>
        </View>
      </PaperProvider>
    </ScrollView>
  );
};

export default DayCalendar;
