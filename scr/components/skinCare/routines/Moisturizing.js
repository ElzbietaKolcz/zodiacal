import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import tw from "twrnc";
import { createClient } from "@supabase/supabase-js";
import Options from "../Options";
import { Text, DataTable, IconButton, DefaultTheme } from "react-native-paper";
import { db, auth } from "../../../../firebase";
import {
  collection,
  doc,
  writeBatch,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { currentYear, currentMonth } from "../../../../variables";
import { useDispatch } from "react-redux";
import {
  addCosmetics,
  removeCosmetics,
  setCosmeticss,
} from "../../../features/cosmeticSlice";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Moisturizing = () => {
  const [cosmetics, setCosmetics] = useState([]);
  const [selectedCosmetics, setSelectedCosmetics] = useState([]);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [userCosmetics, setUserCosmetics] = useState([]);
  const optionsRef = useRef(null);
  const user = auth.currentUser;
  const userId = user?.uid;
  const dispatch = useDispatch();

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "black",
      text: "black",
    },
  };

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

  useEffect(() => {
    if (user) {
      const userCosmeticsCollectionRef = collection(
        db,
        `users/${userId}/${currentYear}/skincare/evening/${currentMonth}/moisturizing`,
      );
      const q = query(userCosmeticsCollectionRef, orderBy("product_name"));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        dispatch(setCosmeticss(data));
        setUserCosmetics(data);
      });

      return () => unsubscribe();
    }
  }, [user, dispatch]);

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

  const handleDelete = async (cosmeticsId) => {
    try {
      const userCosmeticsCollectionRef = collection(
        db,
        `users/${userId}/${currentYear}/skincare/evening/${currentMonth}/moisturizing`,
      );
      await deleteDoc(doc(userCosmeticsCollectionRef, cosmeticsId));
      dispatch(removeCosmetics(cosmeticsId));
      console.log(`Cosmetic with ID ${cosmeticsId} deleted successfully.`);
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
          `users/${userId}/${currentYear}/skincare/evening/${currentMonth}/moisturizing`,
        );

        const batch = writeBatch(db);

        selectedCosmetics.forEach((cosmetic) => {
          const docRef = doc(skincareCollection);
          batch.set(docRef, cosmetic);
          dispatch(addCosmetics(cosmetic));
        });

        await batch.commit();
        console.log(
          "All cosmetics have been saved to Firebase for morning skincare.",
        );

        setSelectedCosmetics([]);
        if (optionsRef.current) {
          optionsRef.current.reset();
        }
      }
    } catch (error) {
      console.error("Error saving cosmetics to Firebase:", error.message);
    }
  };

  return (
    <View>
      <View style={tw`flex-1 p-6 bg-white`}>
        <Text
          variant="headlineSmall"
          style={tw`text-black font-bold text-2xl`}
        >
          Moisturizing
        </Text>
        {cosmetics.length > 0 && (
          <Options
            ref={optionsRef}
            options={cosmetics.map((cosmetic) => cosmetic.product_name)}
            onSelect={handleSelectCosmetic}
            handleFABPress={handleFABPress}
          />
        )}
        <View style={tw`bg-white mb-2 mt-2`}>
          <Text
            style={tw`my-4 text-black`}
            variant="titleLarge"
            testID="title"
          >
            List of Cosmetics
          </Text>

          <View style={tw`flex items-center justify-center shrink rounded-lg`}>
            <DataTable style={tw`border rounded-lg border-black w-full`}>
              <DataTable.Header>
                <DataTable.Title style={tw`flex-2`}>
                  <Text style={tw`text-black text-sm font-bold`}>
                    Product Name
                  </Text>
                </DataTable.Title>
                <DataTable.Title style={tw`flex-2`}>
                  <Text style={tw`text-black text-sm font-bold`}>Brand</Text>
                </DataTable.Title>
                <DataTable.Title style={tw`flex-2`}>
                  <Text style={tw`text-black text-sm font-bold`}>
                    Expiration Date
                  </Text>
                </DataTable.Title>
                <DataTable.Title style={tw`flex-1`}>
                  <Text style={tw`text-black text-sm font-bold`}>Delete</Text>
                </DataTable.Title>
              </DataTable.Header>

              {userCosmetics &&
                userCosmetics
                  .slice(page * itemsPerPage, (page + 1) * itemsPerPage)
                  .map((cosmetic) => (
                    <DataTable.Row
                      key={cosmetic.id}
                      style={tw`border-t border-gray-300`}
                      testID="cosmetic-row"
                    >
                      <DataTable.Cell textStyle={tw`text-black text-center`}>
                        {cosmetic.product_name}
                      </DataTable.Cell>
                      <DataTable.Cell textStyle={tw`text-black text-center`}>
                        {cosmetic.brand}
                      </DataTable.Cell>
                      <DataTable.Cell textStyle={tw`text-black text-center`}>
                        {cosmetic.expiration_date}
                      </DataTable.Cell>
                      <DataTable.Cell>
                        <IconButton
                          icon="delete"
                          iconColor="red"
                          style={tw`justify-center`}
                          onPress={() => handleDelete(cosmetic.id)}
                          testID={`delete-button-${cosmetic.id}`}
                        />
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))}

              <DataTable.Pagination
                page={page}
                numberOfPages={Math.ceil(userCosmetics.length / itemsPerPage)}
                onPageChange={(page) => setPage(page)}
                label={`Showing ${page * itemsPerPage + 1}-${Math.min(
                  (page + 1) * itemsPerPage,
                  userCosmetics.length,
                )} of ${userCosmetics.length}`}
                numberOfItemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
                showFastPaginationControls
                selectPageDropdownLabel={"Rows per page"}
                theme={theme}
              />
            </DataTable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Moisturizing;
