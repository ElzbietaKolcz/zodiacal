import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Button, Provider, FAB } from "react-native-paper";
import { useDispatch } from "react-redux";
import { getDoc, updateDoc, doc } from "@firebase/firestore";
import { db, auth } from "../../../firebase";
import { updateSign } from "../../features/userSlice";
import tw from "twrnc";

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

  const [sign, setSign] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");

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

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <ScrollView>
    <Provider>
    
      <View style={tw`flex-row items-center mt-5 mx-8 my-4`}>
        <View style={tw`flex-col w-48`}>
          <Button
            style={tw`bg-fuchsia-200 rounded-lg text-lg font-bold p-1 mx-1`}
            labelStyle={tw`text-gray-800 font-bold`}
            onPress={openMenu}
          >
            {sign === "" ? "Select zodiac sign" : sign}
          </Button>
          {visible && (
            <ScrollView style={tw`max-h-30 mt-2`}>
              {ZodiacSigns.map((zodiac, index) => (
                <View key={index}>
                  <Button
                    labelStyle={tw`text-fuchsia-800 font-bold`}
                    onPress={() => handleSelect(zodiac.name)}
                  >
                    {zodiac.name}
                  </Button>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

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
        {error ? <Text style={tw`text-red-500`}>{error}</Text> : null}
      </View>
     
    </Provider>
    </ScrollView>
  );
};

export default FormMenu;
