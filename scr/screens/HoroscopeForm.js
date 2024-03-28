import React from "react";
import { View, Image } from "react-native";
import { FAB, Button, Text, Menu } from "react-native-paper";
import { db, auth } from "../../firebase";
import { updateSign } from "../features/userSlice";

import images from "../../assets/images";
import tw from "twrnc";
import { getDoc, updateDoc, doc } from "@firebase/firestore";
import { useDispatch } from "react-redux";

const ZodiacSigns = [
  "aquarius",
  "pisces",
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
];

export default function Horoscope() {
  const user = auth.currentUser;

  const dispatch = useDispatch();

  const [sign, setSign] = React.useState("");
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSelect = (selectedSign) => {
    setSign(selectedSign);
    setVisible(false);
  };

  const handleSubmit = async () => {
    if (sign === "") {
      setError("Please select a zodiac sign");
    } else {
      try {
        if (user) {
          const userId = user.uid;
          const userDocRef = doc(db, "users", userId);
          const userDocSnapshot = await getDoc(userDocRef);
          const userData = userDocSnapshot.data();

          const updatedSign = userData.sign === sign ? "" : sign;

          await updateDoc(userDocRef, { sign: updatedSign });

          console.log("Selected Zodiac Sign:", updatedSign);
          setSign(updatedSign);

          await updateDoc(userDocRef, { sign: updatedSign });

          console.log("Selected Zodiac Sign:", updatedSign);
          setSign(updatedSign);
          dispatch(updateSign(updatedSign));
          setError("");

          setError("");
        } else {
          console.error("No user is currently logged in.");
          setError("Please sign in to update your sign.");
        }
      } catch (error) {
        console.error("Error updating sign in Firebase:", error);
        setError("An error occurred, please try again later.");
      }
    }
  };

  return (
    <View style={tw`flex-1 bg-white justify-center items-center`}>
      <Image
        style={tw`w-full h-60 `}
        source={images.logo}
        resizeMode="contain"
      />
      <View style={tw`items-center justify-center m-5`}>
        <Text style={tw`text-center text-xl text-black `}>
          To access daily horoscopes, enter your zodiac sign or date of birth.
        </Text>

        <Text
          variant="headlineSmall"
          style={tw`text-black font-bold m-4`}
        >
          Choose your zodiac sign
        </Text>

        <View style={tw`flex-row flex-wrap items-center justify-center mt-5`}>
          <Menu
            visible={visible}
            onDismiss={() => setVisible(false)}
            anchor={
              <View style={tw` font-bold text-lg flex-grow 4  `}>
                <Button
                  onPress={() => setVisible(true)}
                  style={tw`bg-fuchsia-50 rounded-lg w-50 text-lg font-bold flex-grow mx-4 `}
                >
                  {sign === "" ? "Select zodiac sign" : sign}
                </Button>
              </View>
            }
          >
            {ZodiacSigns.map((zodiac, index) => (
              <Menu.Item
                key={index}
                onPress={() => handleSelect(zodiac)}
                title={zodiac}
              />
            ))}
          </Menu>

          <View style={tw`m-3`}>
            <FAB
              onPress={handleSubmit}
              style={[tw`bg-fuchsia-700 rounded-full right-1`]}
              size="small"
              icon="plus"
              color="#FFFFFF"
              mode="elevated"
              accessibilityLabel="FAB"
            />
          </View>
        </View>
        <Text style={tw`text-center text-lg text-black m-4`}>
          {" "}
          - Or sign in with -{" "}
        </Text>

        <Text
          variant="headlineSmall"
          style={tw`text-black font-bold m-4`}
        >
          Enter the date
        </Text>
      </View>
    </View>
  );
}
