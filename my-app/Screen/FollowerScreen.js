import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import HeaderAD from "../components/header";
import axios from "axios";
import { BASE_URL } from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FollowerList = ({route}) => {
  const [followers, setFollowers] = useState([]);
  const {id} = route.params
  const fetchFollowers = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const response = await axios.get(`${BASE_URL}/follower/${id}`, {
        headers: {
          access_token: token,
        },
      });
      const data = response.data;

      setFollowers(data);
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  useEffect(() => {
    fetchFollowers();
  }, []);

  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  const Navigation = useNavigation();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Your Followers</Text>
          {followers?.map((follower, index) => (
            <TouchableOpacity key={index} activeOpacity={0.6}>
              <View style={styles.followerContainer}>
                <View style={styles.profilePictureContainer}>
                  <Image
                    source={{ uri: follower.Follower.ProfilePicture.imageUrl }}
                    style={styles.profilePicture}
                  />
                </View>
                <View style={styles.followerContent}>
                  <Text style={styles.username}>
                    {follower.Follower.username}
                  </Text>
                  {/* Add more information about the follower if needed */}
                </View>
              </View>
              {index < followers.length - 1 && (
                <View style={styles.separator} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF3E6",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    fontFamily: "PressStart2P_400Regular",
    marginTop: 50,
    textAlign: "center",
  },
  followerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  profilePictureContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    marginRight: 16,
  },
  profilePicture: {
    width: "100%",
    height: "100%",
  },
  followerContent: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#555555",
    marginVertical: 10,
  },
});
export default FollowerList;
