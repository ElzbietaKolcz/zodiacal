import React, { useState, useEffect } from "react";
import { View } from "react-native";
import tw from "twrnc";
import { createClient } from "@supabase/supabase-js";
import Options from "../Options";
import { IconButton, DataTable, Text } from "react-native-paper";
import { db, auth } from "../../../../firebase";
import { collection, doc, writeBatch } from "firebase/firestore";
import { currentYear } from "../../../../variables";


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Morning = () => {
  const [cosmetics, setCosmetics] = useState([]);
  const [selectedCosmetics, setSelectedCosmetics] = useState([]);
  const user = auth.currentUser;
  
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

  const handleFABPress = async () => {
    try {
      if (user) {
        const userId = user.uid;
        const skincareCollection = collection(
          db,
          `users/${userId}/${currentYear}/skincare/morning`,
        );

        const batch = writeBatch(db);

        selectedCosmetics.forEach((cosmetic) => {
          const docRef = doc(skincareCollection); // Automatically generates a new document ID
          batch.set(docRef, cosmetic);
        });

        await batch.commit();
        console.log(
          "All cosmetics have been saved to Firebase for morning skincare.",
        );
      }
    } catch (error) {
      console.error("Error saving cosmetics to Firebase:", error.message);
    }
  };

  return (
    <View style={tw`mb-6`}>
      <View style={tw`flex-1 p-6 bg-white`}>
        <Text
          variant="headlineSmall"
          style={tw`text-black font-bold text-2xl`}
        >
          Morning
        </Text>
        {cosmetics.length > 0 && (
          <Options
            options={cosmetics.map((cosmetic) => cosmetic.product_name)}
            onSelect={handleSelectCosmetic}
            handleFABPress={handleFABPress}
          />
        )}
      </View>

      <View style={tw`items-center justify-center rounded-lg`}>
        <DataTable style={tw`border rounded-lg text-wrap border-black w-11/12`}>
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

export default Morning;
