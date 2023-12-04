import { View, ScrollView } from "react-native";
import { IconButton, Text, DataTable } from "react-native-paper";
import tw from "twrnc";
import { useDispatch, useSelector } from "react-redux";
import { removeBirthday } from "../features/birthdaySlice";

const EditBirthdays = () => {
  const dispatch = useDispatch();
  const userBirthdays = useSelector((state) => state.birthdays);

  const sortedBirthdays = [...userBirthdays].sort((a, b) => {
    if (a.month !== b.month) {
      return a.month - b.month;
    }
    return a.day - b.day;
  });

  const handleDelete = (birthdayId) => {
    dispatch(removeBirthday(birthdayId));

    console.log(`Birthday with ID ${birthdayId} deleted successfully.`);
  };

  return (
    <ScrollView style={tw`bg-white h-full mb-8 mt-2`}>
      <Text
        style={tw`m-4 text-black`}
        variant="titleLarge"
      >
        List of birthday
      </Text>

      <View style={tw`flex items-center justify-center rounded-lg`}>
        <DataTable style={tw`border rounded-lg border-gray-300 w-5/6`}>
          <DataTable.Header>
            <DataTable.Title style={tw`text-black`}>Day</DataTable.Title>
            <DataTable.Title style={tw`text-black`}>Month</DataTable.Title>
            <DataTable.Title style={tw`text-black`}>Name</DataTable.Title>
            <DataTable.Title style={tw`text-black`}>Delete</DataTable.Title>
          </DataTable.Header>

          {sortedBirthdays.map((birthday) => {
            const formattedDay =
              birthday.day < 10 ? `0${birthday.day}` : birthday.day;
            const formattedMonth =
              birthday.month < 10 ? `0${birthday.month}` : birthday.month;

            return (
              <DataTable.Row
                key={birthday.id}
                style={tw`border-t border-gray-300`}
              >
                <DataTable.Cell>
                  <Text
                    variant="bodyLarge"
                    style={tw`text-black`}
                  >
                    {formattedDay}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text
                    variant="bodyLarge"
                    style={tw`text-black`}
                  >
                    {formattedMonth}
                  </Text>
                </DataTable.Cell>

                <DataTable.Cell>
                  <Text
                    variant="bodyLarge"
                    style={tw`text-black`}
                  >
                    {birthday.name}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <IconButton
                    icon="delete"
                    onPress={() => handleDelete(birthday.id)}
                  />
                </DataTable.Cell>
              </DataTable.Row>
            );
          })}
        </DataTable>
      </View>
    </ScrollView>
  );
};

export default EditBirthdays;
