import React from "react";
import { View, Image, Text } from "react-native";
import images from "../../assets/images";
import tw from "twrnc";
import FormMenu from "./../components/FormMenu";
import FormDate from "./../components/FormDate";

const Horoscope = () => {
  return (
    <View style={tw`flex-1 bg-white justify-center items-center mt-2`}>
      <Image
        style={tw`w-full h-60`}
        source={images.logo}
        resizeMode="contain"
      />
      <View style={tw`items-center justify-center m-4`}>
        <Text style={tw`text-xl text-black w-80 text-center`}>
          To access daily horoscopes, enter your zodiac sign or date of birth.
        </Text>

        <View style={tw`w-full`}>
          <Text
            variant="headlineSmall"
            style={tw`text-black font-bold mt-6 text-2xl`}
          >
            Choose your zodiac sign
          </Text>
        </View>

        <FormMenu />
        <Text style={tw`text-lg text-black font-semibold mt-4 `}>
          {" "}
          ---- Or ----{" "}
        </Text>

        <View style={tw`w-full`}>
          <Text
            variant="headlineSmall"
            style={tw`text-black font-bold mt-6 text-2xl`}
          >
            Enter the date
          </Text>
        </View>
        <FormDate />
      </View>
    </View>
  );
};
export default Horoscope;
