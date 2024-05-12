import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import tw from "twrnc";
import { createClient } from "@supabase/supabase-js";
import Morning from "../components/skinCare/Morning";
import Exfoliation from "../components/skinCare/Exfoliation";
import Moisturizing from "../components/skinCare/Moisturizing";
import Reconstruction from "../components/skinCare/Reconstruction";

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Routines = () => {
  // Define state to hold the cosmetics data
  const [cosmetics, setCosmetics] = useState([]);

  // Fetch cosmetics data from Supabase
  useEffect(() => {
    const fetchCosmetics = async () => {
      try {
        // Query cosmetics data from Supabase
        const { data, error } = await supabase.from("cosmetics").select("*");

        if (error) {
          throw error;
        }

        // Set the retrieved cosmetics data to state
        setCosmetics(data || []);
      } catch (error) {
        console.error("Error fetching cosmetics:", error.message);
      }
    };

    // Call the fetchCosmetics function
    fetchCosmetics();
  }, []); // Execute only once when component mounts

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
