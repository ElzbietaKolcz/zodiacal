import { View, Text } from "react-native";
import tw from "twrnc";
import { useSelector } from "react-redux";

const SkinCare = () => {
  const data = useSelector(state => state.cosmetics)
    return (
      <View style={tw`flex-1 bg-white justify-center items-center`}>
        <Text style={tw`text-center text-xl font-semibold `}>Skin Care</Text>
        {
          data.map((cosmetic, index) => (
            <Text key={index}>{cosmetic.product_name}</Text>
          ))
        }
        <Text style={tw`text-center`}>test</Text>
      </View>
    );
};

export default SkinCare;
