import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { TextInput, HelperText, FAB, Text } from "react-native-paper";
import { db, auth } from "../../firebase";
import { updateSign } from "../features/userSlice";
import tw from "twrnc";
import { getDoc, updateDoc, doc } from "@firebase/firestore";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";

const FormDate = () => {
  const user = auth.currentUser;
  const dispatch = useDispatch();

  const findZodiacSign = (day, month) => {
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

    const sign = ZodiacSigns.find(({ start, end }) => {
      if (month === start[1] && day >= start[0]) return true;
      if (month === end[1] && day <= end[0]) return true;
      return false;
    });
    return sign ? sign.name : "";
  };

  const validationSchema = yup.object().shape({
    day: yup
      .number()
      .integer()
      .typeError("Must be a number")
      .min(1, "Must be at least 1")
      .max(31, "Must be at most 31"),
    month: yup
      .number()
      .integer()
      .typeError("Must be a number")
      .min(1, "Must be at least 1")
      .max(12, "Must be at most 12"),
  });

  const handleSubmit = async (values) => {
    const { day, month } = values;
    try {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();

        const zodiacSign = findZodiacSign(parseInt(day), parseInt(month));
        const updatedSign = userData.sign === zodiacSign ? "" : zodiacSign;

        await updateDoc(userDocRef, { sign: updatedSign });

        console.log("Selected Zodiac Sign:", updatedSign);

        dispatch(updateSign(updatedSign));
      }
    } catch (error) {
      console.error("Error updating sign in Firebase:", error);
    }
  };

  const ZodiacSign = ({ day, month }) => {
    const [sign, setSign] = useState("");

    useEffect(() => {
      const zodiacSign = findZodiacSign(parseInt(day), parseInt(month));
      setSign(zodiacSign);
    }, [day, month]);

    return (
      <View style={tw`w-full items-center justify-center`}>
        <Text style={tw`text center `}>Zodiac sign: {sign}</Text>
      </View>
    );
  };

  return (
    <Formik
      initialValues={{ day: "", month: "" }}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({
        values,
        handleSubmit,
        handleChange,
        isValid,
        errors,
        isSubmitting,
      }) => (
        <View style={tw``}>
          <View style={tw`flex-row flex-wrap mt-5`}>
            <View style={tw`mb-4 w-40`}>
              <TextInput
                style={tw`bg-fuchsia-50 rounded-lg mx-1 `}
                label="Day"
                value={values.day}
                onChangeText={handleChange("day")}
                activeUnderlineColor="#a21caf"
                accessibilityLabel="Day"
              />
              <HelperText
                type="error"
                visible={errors.day ? true : false}
              >
                {errors.day}
              </HelperText>
            </View>

            <View style={tw`mb-4 w-40`}>
              <TextInput
                style={tw`bg-fuchsia-50 rounded-lg mx-1  `}
                label="Month"
                value={values.month}
                onChangeText={handleChange("month")}
                activeUnderlineColor="#a21caf"
                accessibilityLabel="Month"
              />
              <HelperText
                type="error"
                visible={errors.month ? true : false}
              >
                {errors.month}
              </HelperText>
            </View>

            <View style={tw`m-3`}>
              <FAB
                onPress={handleSubmit}
                disabled={!isValid || isSubmitting}
                style={[
                  tw`bg-fuchsia-700 rounded-full  right-1`,
                  isValid ? tw`bg-[#9C27B0]` : tw`bg-gray-500`,
                ]}
                size="small"
                icon="plus"
                color="#FFFFFF"
                mode="elevated"
                accessibilityLabel="FAB"
              />
            </View>
          </View>
          <ZodiacSign
            day={parseInt(values.day)}
            month={parseInt(values.month)}
          />
        </View>
      )}
    </Formik>
  );
};

export default FormDate;
