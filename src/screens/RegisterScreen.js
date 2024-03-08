import { Button, Text, View } from "react-native";

export default function RegisterScreen() {
  const handleLogin = () => {
    // rewrite it with firebase logic
    navigation.navigate("Home");
  };
  const handleRegister = () => {
    // rewrite it with firebase logic
    navigation.navigate("Login");
  };
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Register Screen</Text>
      <Button title="Register" onPress={handleRegister} />
      <Button title="Go back to login page" onPress={handleRegister} />
    </View>
  );
}
