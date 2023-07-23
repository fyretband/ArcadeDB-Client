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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config/api";

function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegisterMenu = () => {
    navigation.navigate("Register");
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/users/login`, {
        email: email,
        password: password,
      });
      const token = response.data.token;
      const premium = response.data.premium;
      const id = response.data.id;
      await AsyncStorage.setItem("access_token", token);
      await AsyncStorage.setItem("premium", JSON.stringify(premium));
      await AsyncStorage.setItem("id", JSON.stringify(id));
      navigation.navigate("Dashboard");
    } catch (error) {
      console.error(error);
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
          Login
        </Text>

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
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text
            style={[
              styles.buttonText,
              { fontFamily: "PressStart2P_400Regular" },
            ]}
          >
            Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRegisterMenu}>
          <Text
            style={[
              styles.signupText,
              { fontFamily: "PressStart2P_400Regular" },
            ]}
          >
            New To Us? Register
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
  orText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#6F6B65",
  },
  socialIcon: {
    marginRight: 10,
    color: "#0F9D58",
  },
  socialButtonText: {
    color: "#6F6B65",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  signupText: {
    marginTop: 20,
    color: "#6F6B65",
  },
});

export default LoginScreen;
