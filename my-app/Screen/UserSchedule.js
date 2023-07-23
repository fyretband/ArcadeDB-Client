import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Axios from "axios";
import { BASE_URL } from "../config/api";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";

const UserSchedule = () => {
  const [user, setUser] = useState({});
  const route = useRoute();

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    console.log("adib vue");
    try {
      const id = await AsyncStorage.getItem("id");
      const { data } = await Axios.get(`${BASE_URL}/users/${id}`);
      console.log(data, "ini response dari data");
      setUser(data);
      // return response.data;
    } catch (error) {
      console.error("Error fetching user schedule:", error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>My Schedule</Text>
        {user?.Session?.map((item, index) => (
          <View style={styles.scheduleItem} key={index}>
            <View style={styles.detailsContainer}>
              <Text style={styles.date}>
                {" "}
                You will played in {item.Arcade.name} on
              </Text>
              <Text style={styles.arcadeName}>
                {" "}
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
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
    marginLeft: 20,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 40,
    height: 40,
  },
  detailsContainer: {
    marginLeft: 10,
  },
  arcadeName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  date: {
    fontSize: 16,
    color: "gray",
  },
});

export default UserSchedule;
