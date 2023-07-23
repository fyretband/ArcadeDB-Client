import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import { useFonts } from "expo-font";
import axios from "axios";
import { BASE_URL } from "../config/api";
function RegisterScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/users/register`, {
        username,
        email,
        password,
      });
      console.log(response.data); // You can handle the response data here

      // After successful registration, navigate to the Menu screen
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
      // Handle errors here, such as displaying error messages
    }
  };

  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../assets/icon/logo2.png")}
          style={styles.image}
        />
        <Text style={[styles.title, { fontFamily: "PressStart2P_400Regular" }]}>
          Register
        </Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person" size={24} color="gray" style={styles.icon} />
          <TextInput
            style={[styles.input, { fontFamily: "PressStart2P_400Regular" }]}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={24} color="gray" style={styles.icon} />
          <TextInput
            style={[styles.input, { fontFamily: "PressStart2P_400Regular" }]}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed"
            size={24}
            color="gray"
            style={styles.icon}
          />
          <TextInput
            style={[styles.input, { fontFamily: "PressStart2P_400Regular" }]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text
            style={[
              styles.buttonText,
              { fontFamily: "PressStart2P_400Regular" },
            ]}
          >
            Register
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text
            style={[
              styles.loginText,
              { fontFamily: "PressStart2P_400Regular" },
            ]}
          >
            Already registered? Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF3E6",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 400,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: "gray",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: "gray",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  loginText: {
    marginTop: 20,
    color: "#6F6B65",
  },
});

export default RegisterScreen;
