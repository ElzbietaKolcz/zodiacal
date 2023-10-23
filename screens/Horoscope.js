import React from "react";
import { View, Text } from "react-native";
import { useGetHoroscopeQuery } from "../services/astrologyApi";

export default function Horoscope() {
  const sign = "aquarius";

  const {
    data: horoscopeData,
    isError,
    isLoading,
    isSuccess,
  } = useGetHoroscopeQuery(sign);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error loading horoscope data.</Text>;
  }

  if (isSuccess) {
    const horoscope = horoscopeData.horoscope;
    return (
      <View>
        <Text>Today, your horoscope for {sign} is...</Text>
        <Text>{horoscope}</Text>
      </View>
    );
  }

  return null;
}
