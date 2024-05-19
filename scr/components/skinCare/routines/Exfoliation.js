import React, { useState, useEffect } from "react";
import { View } from "react-native";
import tw from "twrnc";
import { createClient } from "@supabase/supabase-js";
import Options from "../Options";
import { IconButton, DataTable, Text } from "react-native-paper";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Exfoliation = () => {
  const [cosmetics, setCosmetics] = useState([]);
  const [selectedCosmetics, setSelectedCosmetics] = useState([]);

  useEffect(() => {
    const fetchCosmetics = async () => {
      try {
        const { data, error } = await supabase
          .from("cosmetics")
          .select("id, product_name, brand, expiration_date");

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

  const handleSelectCosmetic = (option) => {
    const selectedCosmetic = cosmetics.find(
      (cosmetic) => cosmetic.product_name === option,
    );

    if (selectedCosmetic) {
      setSelectedCosmetics((prevSelected) => [
        ...prevSelected,
        selectedCosmetic,
      ]);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("cosmetics").delete().eq("id", id);

      if (error) {
        throw error;
      }

      setSelectedCosmetics((prevSelected) =>
        prevSelected.filter((cosmetic) => cosmetic.id !== id),
      );
    } catch (error) {
      console.error("Error deleting cosmetic:", error.message);
    }
  };

  return (
    <View style={tw`mb-10`}>
      <View style={tw`flex-1 p-6 bg-white `}>
        <Text
          variant="headlineSmall"
          style={tw`text-black font-bold text-2xl`}
        >
          Exfoliation
        </Text>
        {cosmetics.length > 0 && (
          <Options
            options={cosmetics.map((cosmetic) => cosmetic.product_name)}
            onSelect={handleSelectCosmetic}
          />
        )}
      </View>

      <View style={tw` items-center justify-center rounded-lg`}>
        <DataTable
          style={tw` border rounded-lg text-wrap border-black w-11/12`}
        >
          <DataTable.Header>
            <DataTable.Title
              style={tw`flex-2`}
              textStyle={tw`text-black text-sm font-bold`}
            >
              Name
            </DataTable.Title>
            <DataTable.Title
              style={tw`flex-1`}
              textStyle={tw`text-black text-sm font-bold`}
            >
              Brand
            </DataTable.Title>
            <DataTable.Title
              style={tw`flex-1`}
              textStyle={tw`text-black text-sm font-bold`}
            >
              Date
            </DataTable.Title>
            <DataTable.Title
              style={tw`flex-1`}
              textStyle={tw`text-black text-sm font-bold`}
            >
              Delete
            </DataTable.Title>
          </DataTable.Header>

          {selectedCosmetics.map((cosmetic) => (
            <DataTable.Row key={cosmetic.id}>
              <DataTable.Cell
                style={tw`flex-2`}
                textStyle={tw`text-black text-sm flex-wrap break-words`}
              >
                {cosmetic.product_name}
              </DataTable.Cell>
              <DataTable.Cell
                style={tw`flex-1`}
                textStyle={tw`text-black text-sm flex-wrap break-words`}
              >
                {cosmetic.brand}
              </DataTable.Cell>
              <DataTable.Cell
                style={tw`flex-1`}
                textStyle={tw`text-black text-sm flex-wrap break-words`}
              >
                {cosmetic.expiration_date}
              </DataTable.Cell>
              <DataTable.Cell
                style={tw`flex-1`}
                textStyle={tw`text-black text-sm flex-wrap break-words`}
              >
                <IconButton
                  iconColor="red"
                  icon="delete"
                  onPress={() => handleDelete(cosmetic.id)}
                />
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </View>
    </View>
  );
};

export default Exfoliation;
