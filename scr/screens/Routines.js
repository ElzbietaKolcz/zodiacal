import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import tw from "twrnc";
import { createClient } from "@supabase/supabase-js";
import Morning from "../components/skinCare/Morning";
import Exfoliation from "../components/skinCare/Exfoliation";
import Moisturizing from "../components/skinCare/Moisturizing";
import Reconstruction from "../components/skinCare/Reconstruction";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Routines = () => {
  const [cosmetics, setCosmetics] = useState([]);

  useEffect(() => {
    const fetchCosmetics = async () => {
      try {
        const { data, error } = await supabase.from("cosmetics").select("*");

        if (error) {
          throw error;
        }

        setCosmetics(data || []);
      } catch (error) {
        console.error("Error fetching cosmetics:", error.message);
      }
    };

    fetchCosmetics();
  }, []); 

  return (
    <ScrollView style={tw` bg-white h-full w-full`}>
      <Morning />
      <Exfoliation />
      <Moisturizing />
      <Reconstruction />
    </ScrollView>
  );
};

export default Routines;
