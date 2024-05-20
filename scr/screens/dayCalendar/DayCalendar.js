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
  const containerStyle = tw`bg-white mx-8 my-10 h-full rounded-lg`;

  return (
    <ScrollView style={tw` bg-white h-full w-full`}>
      <PaperProvider>
        <View  style={tw` mb-8`}>
          <CustomAgenda />

          <Portal>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={containerStyle}
            >
              
              <EditTaskEvent />
            </Modal>
          </Portal>
          <View style={tw` mt-6`}>
            <View style={tw`mt-2 w-full flex-row justify-between items-center`}>
              <Text
                style={tw`ml-4 text-black`}
                variant="titleLarge"
              >
                Add new task / event{" "}
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
          <View style={tw`my-2 mx-4 `}>
            <Text
              variant="headlineSmall"
              style={tw`text-black font-bold mt-6 text-2xl`}
            >
              Goals for this weekend
            </Text>

            <View>
              <View>
                <InputGoalWeek index={0} />
                <InputGoalWeek index={1} />
                <InputGoalWeek index={2} />
              </View>
            </View>
          </View>
        </View>
      </PaperProvider>
    </ScrollView>
  );
};

export default DayCalendar;
