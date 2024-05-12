import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { createClient } from "@supabase/supabase-js";
import Options from "../Options";
import { IconButton, DataTable } from "react-native-paper";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Morning = () => {
  const [cosmetics, setCosmetics] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const fetchCosmetics = async () => {
      try {
        const { data, error } = await supabase
          .from("cosmetics")
          .select("product_name, brand, expiration_date");

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
    setSelectedOption(selectedCosmetic);
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("cosmetics").delete().eq("id", id);

      if (error) {
        throw error;
      }

      // Refresh cosmetics after deletion
      const { data: newData, error: newError } = await supabase
        .from("cosmetics")
        .select("product_name, brand, expiration_date");

      if (newError) {
        throw newError;
      }

      setCosmetics(newData || []);
    } catch (error) {
      console.error("Error deleting cosmetic:", error.message);
    }
  };

  return (
    <View>
      <View style={tw`flex-1 p-6 bg-white `}>
        <Text style={tw` text-xl font-semibold`}>Morning</Text>
        {cosmetics.length > 0 && (
          <Options
            options={cosmetics.map((cosmetic) => cosmetic.product_name)}
            onSelect={handleSelectCosmetic} // Przekazanie funkcji do komponentu Options
          />
        )}
        {/* Wyświetlenie wybranej opcji w Morning */}
        {selectedOption && (
          <View>
            <Text>Selected Option in Morning:</Text>
            <Text>Name: {selectedOption.product_name}</Text>
            <Text>Brand: {selectedOption.brand}</Text>
            <Text>Expiration Date: {selectedOption.expiration_date}</Text>
          </View>
        )}
        {/* ... */}
      </View>

      <View style={tw`flex items-center justify-center rounded-lg`}>
        <DataTable
          style={tw` border rounded-lg flex-wrap border-gray-300 w-11/12`}
        >
          <DataTable.Header>
            <DataTable.Title
              style={[tw`flex-3`, { flexBasis: 0 }]}
              textStyle={tw`text-black text-sm bold`}
            >
              Name
            </DataTable.Title>
            <DataTable.Title
              style={[tw`flex-2`, { flexBasis: 0 }]}
              textStyle={tw`text-black text-sm bold`}
            >
              Brand
            </DataTable.Title>
            <DataTable.Title
              style={[tw`flex-2`, { flexBasis: 0 }]}
              textStyle={tw`text-black text-sm bold`}
            >
              Expiration
            </DataTable.Title>
            <DataTable.Title
              style={[tw`flex-1`, { flexBasis: 0 }]}
              textStyle={tw`text-black text-sm bold`}
            >
              Delete
            </DataTable.Title>
          </DataTable.Header>

          <DataTable.Row key={selectedOption ? selectedOption.id : ""}>
            <DataTable.Cell
              style={[tw`flex-3`, { flexShrink: 1 }]}
              textStyle={tw`text-black whitespace-normal break-words text-sm bold`}
            >
              {selectedOption ? selectedOption.product_name : ""}
            </DataTable.Cell>
            <DataTable.Cell
              style={[tw`flex-2 `, { flexBasis: 0 }]}
              textStyle={tw`text-black text-sm bold`}
            >
              {selectedOption ? selectedOption.brand : ""}
            </DataTable.Cell>
            <DataTable.Cell
              style={[tw`flex-2`, { flexBasis: 0 }]}
              textStyle={tw`text-black text-sm bold`}
            >
              {selectedOption ? selectedOption.expiration_date : ""}
            </DataTable.Cell>
            <DataTable.Cell
              style={[tw`flex-1`, { flexBasis: 0 }]}
              textStyle={tw`text-black text-sm bold`}
            >
              {selectedOption && (
                <IconButton
                  icon="delete"
                  onPress={() => handleDelete(selectedOption.id)}
                />
              )}
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </View>
    </View>
  );
};

export default Morning;
