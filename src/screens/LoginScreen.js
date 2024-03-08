import { Button, Text, View } from "react-native";

export default function LoginScreen({ navigation }) {
  const handleLogin = () => {
    // rewrite it with firebase logic
    navigation.navigate("Home");
  };
  const handleRegister = () => {
    // rewrite it with firebase logic
    navigation.navigate("Register");
  };
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>LoginScreen</Text>
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}
