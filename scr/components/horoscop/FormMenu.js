import React from "react";
import { View } from "react-native";

import { db, auth } from "../../../firebase";
import { updateSign } from "../../features/userSlice";

import tw from "twrnc";
import { getDoc, updateDoc, doc } from "@firebase/firestore";
import { useDispatch } from "react-redux";

import { Text, Menu, Button, FAB } from "react-native-paper";

const ZodiacSigns = [
  { name: "aquarius", start: [20, 1], end: [18, 2] },
  { name: "pisces", start: [19, 2], end: [20, 3] },
  { name: "aries", start: [21, 3], end: [19, 4] },
  { name: "taurus", start: [20, 4], end: [20, 5] },
  { name: "gemini", start: [21, 5], end: [20, 6] },
  { name: "cancer", start: [21, 6], end: [22, 7] },
  { name: "leo", start: [23, 7], end: [22, 8] },
  { name: "virgo", start: [23, 8], end: [22, 9] },
  { name: "libra", start: [23, 9], end: [22, 10] },
  { name: "scorpio", start: [23, 10], end: [21, 11] },
  { name: "sagittarius", start: [22, 11], end: [21, 12] },
  { name: "capricorn", start: [22, 12], end: [19, 1] },
];

const FormMenu = () => {
  const dispatch = useDispatch();
  const user = auth.currentUser;

  const [sign, setSign] = React.useState("");
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSelect = (selectedSign) => {
    setSign(selectedSign);
    setVisible(false);
  };

  const handleSubmitMenu = async () => {
    if (sign === "") {
      setError("Please select a zodiac sign");
    } else {
      try {
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          const userData = userDocSnapshot.data();

          const updatedSign = userData.sign === sign ? "" : sign;

          await updateDoc(userDocRef, { sign: updatedSign });

          console.log("Selected Zodiac Sign:", updatedSign);
          setSign(updatedSign);

          dispatch(updateSign(updatedSign));
        }
      } catch (error) {
        console.error("Error updating sign in Firebase:", error);
        setError("An error occurred, please try again later.");
      }
    }
  };

  return (
    <View style={tw`flex-row  flex-wrap items-center justify-center mt-5`}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <View style={tw`font-bold text-lg mx-1`}>
            <Button
              onPress={() => setVisible(true)}
              style={tw`bg-fuchsia-100 text-left rounded-lg w-77 p-2 text-lg font-bold mx-4  mx-1`}
            >
              <Text style={tw`text-lg text-black text-left`}>
                {sign === "" ? "Select zodiac sign" : sign}
              </Text>
            </Button>
          </View>
        }
      >
        {ZodiacSigns.map((zodiac, index) => (
          <Menu.Item
            key={index}
            onPress={() => handleSelect(zodiac.name)}
            title={zodiac.name}
          />
        ))}
      </Menu>

      <View style={tw`m-3`}>
        <FAB
          onPress={handleSubmitMenu}
          style={[tw`bg-fuchsia-700 rounded-full right-1`]}
          size="small"
          icon="plus"
          color="#FFFFFF"
          mode="elevated"
          accessibilityLabel="FAB"
        />
      </View>
    </View>
  );
};
export default FormMenu;
