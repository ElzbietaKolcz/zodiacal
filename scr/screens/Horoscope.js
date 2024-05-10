import React from "react";
import { View, Text, Image } from "react-native";
import { useGetHoroscopeQuery } from "../services/astrologyApi";
import images from "../../assets/images";
import tw from "twrnc";
import { useSelector } from "react-redux";
// import {  getISOWeek } from "date-fns";

export default function Horoscope() {
  const sign = useSelector((state) => state.user.user.sign);

  const {
    data: horoscopeData,
    isError,
    isLoading,
    isSuccess,
  } = useGetHoroscopeQuery(sign);

  //@TODO Refactor this
  //  if (isLoading) {
    // return (
    //   <View style={tw`flex-1 justify-center items-center`}>
    //     <Text style={tw`text-center text-xl font-semibold text-2xl`}>
    //       Loading...
    //     </Text>
    //   </View>
    // );
    
  //  }else if(isError) {
    // return (
    //   <View style={tw`flex-1 justify-center items-center`}>
    //     <Text>Error loading horoscope data.</Text>
    //   </View>
    // );

  //  } else {
    // const horoscope = horoscopeData.horoscope;
    // const signImage = images[sign]; 

    // return (
    //   <View style={tw`flex-1 bg-white justify-center items-center`}>
    //     <Image
    //       style={tw`w-full h-60 `}
    //       source={signImage} 
    //       resizeMode="contain"
    //     />
    //     <View style={tw`items-center justify-center mt-5`}>
    //       <Text style={tw`text-center text-xl font-semibold `}>
    //         Your horoscope for today
    //       </Text>
    //       <Text style={tw`text-lg mt-5 mx-7`}>{horoscope}</Text>
    //     </View>
    //   </View>
    // );
  //  }

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-center text-xl font-semibold text-2xl`}>
          Loading...
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Error loading horoscope data.</Text>
      </View>
    );
  }

  if (isSuccess) {
    const horoscope = horoscopeData.horoscope;
    const signImage = images[sign]; 

    return (
      <View style={tw`flex-1 bg-white justify-center items-center`}>
        <Image
          style={tw`w-full h-60 `}
          source={signImage} 
          resizeMode="contain"
        />
        <View style={tw`items-center justify-center mt-5`}>
          <Text style={tw`text-center text-xl font-semibold `}>
            Your horoscope for today
          </Text>
          <Text style={tw`text-lg mt-5 mx-7`}>{horoscope}</Text>
        </View>
      </View>
    );
  }

  return null;
}
