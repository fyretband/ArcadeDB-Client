import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import HeaderAD from "../components/header";
import { PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import { BASE_URL } from "../config/api";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const InboxScreen = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });
  const [userId, setUserId] = useState("");
  const navigation = useNavigation();
  useFocusEffect(useCallback(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        const response = await fetchInbox(token);
        setMessages(response.messages);
        const usersData = await fetchUser();
        setUsers(usersData);
        setUserId(await AsyncStorage.getItem("id"));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []))
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("access_token");
  //       const response = await fetchInbox(token);
  //       setMessages(response.messages);
  //       const usersData = await fetchUser();
  //       setUsers(usersData);
  //       setUserId(await AsyncStorage.getItem("id"));
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/users`);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const fetchInbox = async (token) => {
    try {
      const { data } = await axios(`${BASE_URL}/inbox`, {
        headers: {
          access_token: token,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const handlePressMessage = (message) => {
    navigation.navigate("Message", { message });
  };

  const getUserName = (senderId) => {
    const user = users.find((user) => user.id === senderId);
    return user ? user.username : "";
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Inbox</Text>
        <ScrollView>
          {Object.keys(messages).map((key, index) => {
            console.log(key);
            const message = messages[key];
            const senderName = getUserName(
              message.senderId == userId ? message.receiverId : message.senderId
            );
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handlePressMessage(message)}
                activeOpacity={0.6}
              >
                <View style={styles.messageContainer}>
                  <Ionicons
                    name="person-circle-outline"
                    size={48}
                    color="#128C7E"
                    style={styles.icon}
                  />
                  <View style={styles.messageContent}>
                    <Text style={styles.sender}>{senderName}</Text>
                    <Text style={styles.message}>{message.message}</Text>
                  </View>
                </View>
                {index < Object.keys(messages).length - 1 && (
                  <View style={styles.separator} />
                )}
              </TouchableOpacity>
            );
          })}
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
    paddingTop: 5,
  },
  title: {
    marginTop: 50,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    fontFamily: "PressStart2P_400Regular",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    marginRight: 16,
  },
  messageContent: {
    flex: 1,
  },
  sender: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: "#555555",
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    marginTop: 0,
    marginBottom: 5,
  },
});

export default InboxScreen;
