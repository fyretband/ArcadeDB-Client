import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
} from "react-native";
import { BASE_URL } from "../config/api";
import HeaderAD from "../components/header";
import { useNavigation } from "@react-navigation/native";
const SearchAccount = () => {
  const Navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [profilePictures, setProfilePictures] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchProfilePictures();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users`);
      const data = await response.json();
      setUsers(data);
      setOriginalUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchProfilePictures = async () => {
    try {
      const response = await fetch(`${BASE_URL}/pfps`);
      const data = await response.json();
      setProfilePictures(data);
    } catch (error) {
      console.error("Error fetching profile pictures:", error);
    }
  };

  const handleDetail = (id) => {
    Navigation.navigate("VisitAccount", id);
    console.log(id);
  };

  const handleSearch = () => {
    const filteredUsers = originalUsers.filter(
      (user) =>
        user.username &&
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setUsers(filteredUsers);
  };

  const handleResetSearch = () => {
    setSearchQuery("");
    setUsers(originalUsers);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.searchContainer} onPress={handleDetail}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Friends..."
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
          <TouchableOpacity style={styles.searchIcon} onPress={handleSearch}>
            <Image
              source={require("../assets/icon/searchIcon.png")}
              style={styles.iconImage}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleDetail(item.id)}
            >
              <Image
                source={{
                  uri: profilePictures.find((profile) => profile.id === item.id)
                    ?.imageUrl,
                }}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardText}>{item.username}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.flatlistContent}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF3E6",
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 50,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 15,
    marginRight: 8,
    fontSize: 12,
  },
  searchIcon: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 10,
  },
  iconImage: {
    width: 24,
    height: 20,
  },
  flatlistContent: {
    paddingBottom: 16,
  },
  card: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    elevation: 2,
  },
  cardImage: {
    width: "100%",
    height: "70%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
});

export default SearchAccount;
