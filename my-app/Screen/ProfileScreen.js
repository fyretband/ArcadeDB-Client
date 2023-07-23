import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import { useFonts } from "expo-font";

function EditProfileScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [selectedProfile, setSelectedProfile] = useState("");

  const handleViewMenu = () => {
    navigation.navigate("Menu");
  };

  const handleOptionProfile = (value) => {
    setSelectedProfile(value);
  };

  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  const options = [
    {
      label: "Option 1",
      value: "option1",
      imageSource: require("../assets/image/user1.png"),
    },
    {
      label: "Option 2",
      value: "option2",
      imageSource: require("../assets/image/user2.png"),
    },
    {
      label: "Option 3",
      value: "option3",
      imageSource: require("../assets/image/user3.png"),
    },
  ];

  const renderOptionImage = (optionValue) => {
    const selectedOption = options.find(
      (option) => option.value === optionValue
    );
    if (selectedOption) {
      return (
        <View style={styles.optionImageContainer}>
          <Image
            style={styles.optionImage}
            source={selectedOption.imageSource}
          />
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Change Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Choose Profile Picture</Text>
          <Picker
            style={styles.picker}
            selectedValue={selectedProfile}
            onValueChange={handleOptionProfile}
          >
            {options.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
          {renderOptionImage(selectedProfile)}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleViewMenu}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "gold" }]}
          onPress={handleViewMenu}
        >
          <Text style={styles.buttonText}>Buy Subscription</Text>
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
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#6F6B65",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  picker: {
    width: "100%",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    marginBottom: 10,
  },
  optionImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 100,
    overflow: "hidden",
    marginRight: 10,
  },
  optionImage: {
    width: "100%",
    height: "100%",
  },
  button: {
    backgroundColor: "#64FCD9",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    marginTop: 10,
  },
  buttonText: {
    color: "#6F6B65",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
