import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList, Image } from "react-native";
import {
  useFonts,
  PressStart2P_400Regular,
} from "@expo-google-fonts/press-start-2p";
import arcadeImage from "../assets/image/imagesArcade.png";
import HeaderAD from "../components/header";
import axios from "axios";
import { BASE_URL } from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BookmarkList = () => {
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      if (token) {
        const config = {
          headers: {
            access_token: token,
          },
        };

        const response = await axios.get(`${BASE_URL}/bookmarks`, config);

        setBookmarks(response.data.Bookmark);
      } else {
        console.log("Token not found");
        // Handle the case when the token is not available in AsyncStorage
      }
    } catch (error) {
      console.log("Error fetching bookmarks", error);
      // Handle any errors that occur during the fetch
    }
  };

  if (!fontsLoaded) {
    return null;
  }
  const ratingMap = {
		5: "★★★★★",
		4: "★★★★",
		3: "★★★",
		2: "★★",
		1: "★",
		0: "No rating yet"
	};

  return (
    <>
      <View style={styles.container}>
        <Text style={[styles.title, { fontFamily: "PressStart2P_400Regular" }]}>
          Bookmark List
        </Text>

        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.Arcade.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.card, { marginBottom: 30 }]}>
              <Image source={{ uri: item.Arcade.Brand.imageUrl }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardText}>{item.Arcade.name}</Text>
                <Text style={[styles.cardText, {color:"orange"}]}>{ratingMap[Math.floor(item.Arcade.rating)]}</Text>
              </View>
            </View>
          )}
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
  title: {
    marginTop: 50,
    color: "#6F6B65",
    fontSize: 16,
    marginBottom: 16,
  },
  card: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    marginRight: 10,
  },
  cardImage: {
    width: "100%",
    height: "70%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardContent: {
    flex: 1,
    marginLeft: 10,
  },
  cardText: {
    marginTop: 10,
    fontSize: 12,
    color: "#000000",
    fontFamily: "PressStart2P_400Regular",
  },
});

export default BookmarkList;
