import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { createClient } from "@supabase/supabase-js";
import Options from "../Options"; 

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Moisturizing = () => {
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
    <View style={tw`flex-1 p-6 bg-white `}>
      <Text style={tw` text-xl font-semibold`}>Moisturizing</Text>
      {cosmetics.length > 0 && (
        <Options options={cosmetics.map((cosmetic) => cosmetic.product_name)} />
      )}
    </View>
  );
};

export default Moisturizing;
