import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import { useFonts } from "expo-font";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { fetchGame, fetchArcade, fetchArcadeDetail } from "../Reducer/game";
import HeaderAD from "../components/header";
import AsyncStorage from "@react-native-async-storage/async-storage";
const windowHeight = Dimensions.get("window").height;
function HomeScreen() {
  const [userLocation, setUserLocation] = React.useState({});
  const recommendations = useSelector((state) => state.arcades);
  const games = useSelector((state) => state.games);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleFetchGame = async () => {
      await dispatch(fetchGame());
      await dispatch(fetchArcade());
      AsyncStorage.getItem("access_token")
        .then((token) => {
          console.log(token);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    handleFetchGame();
  }, []);

  useEffect(() => {
    const fetchArcadeDetails = async () => {
      for (const recommendation of recommendations[0] || []) {
        await dispatch(fetchArcadeDetail(recommendation.id));
      }
    };
    fetchArcadeDetails();
  }, [recommendations]);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      try {
        const location = await Location.getCurrentPositionAsync();
        const { latitude, longitude } = location.coords;
        setUserLocation({
          userLat: latitude,
          userLong: longitude,
        });
      } catch (error) {
        console.log("Error while fetching location:", error);
      }
    }
  };

  requestLocationPermission();
  const navigation = useNavigation();

  const handlePage = (page) => {
    navigation.navigate(page);
  };

  const handleArcadeDetail = (id) => {
    navigation.navigate("ArcadeDetail", { id });
  };

  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });
  const ratingMap = {
		5: "★★★★★",
		4: "★★★★",
		3: "★★★",
		2: "★★",
		1: "★",
		0: "No rating yet"
	};

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Header */}
        <Image
          source={require("../assets/image/arcadeImage2.png")}
          style={styles.wallpaper}
        />

        <View style={styles.containerBody}>
          <View style={styles.header}>
            <View style={styles.squareContainer}>
              <TouchableOpacity onPress={() => handlePage("GameList")}>
                <View style={[styles.square]}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name="game-controller"
                      size={24}
                      color="#FFFFFF"
                    />
                  </View>
                  <Text style={styles.squareText}>All Games</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handlePage("Bookmark")}>
                <View style={[styles.square]}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name="bookmark-outline"
                      size={24}
                      color="#FFFFFF"
                    />
                  </View>
                  <Text style={styles.squareText}>Bookmark</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handlePage("SearchAccount")}>
                <View style={[styles.square]}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name="person-add-outline"
                      size={24}
                      color="#FFFFFF"
                    />
                  </View>
                  <Text style={styles.squareText}>Find Account</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.squareContainer,
                { justifyContent: "flex-start", width: "150%" },
              ]}
            >
              <TouchableOpacity onPress={() => handlePage("UserSchedule")}>
                <View
                  style={[
                    styles.square,
                    {
                      width: "100%",
                      flexDirection: "row",
                      marginBottom: -10,
                    },
                  ]}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name="calendar-outline"
                      size={24}
                      color="#FFFFFF"
                    />
                  </View>
                  <Text
                    style={[
                      styles.squareText,
                      { marginLeft: 5, marginTop: 5, fontSize: 10 },
                    ]}
                  >
                    Schedule
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.recommendationsText}>Recommendation Arcades</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommendations[0]?.map((recommendation) => (
              <TouchableOpacity
                key={recommendation.id}
                onPress={() => handleArcadeDetail(recommendation.id)}
              >
                <View style={styles.card}>
                  <Image
                    source={{ uri: recommendation.Brand.imageUrl }}
                    style={styles.cardImage}
                  />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardText}>{recommendation.name}</Text>
                    <Text style={[styles.cardText, {color:"orange"}]}>{ratingMap[Math.floor(recommendation.rating)]}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Recommendation Games */}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    height: windowHeight,
    backgroundColor: "#FDF3E6",
  },
  containerBody: {
    padding: 20,
  },
  header: {
    position: "relative",
    marginTop: -50,
    padding: 10,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#CCCCCC",
  },
  wallpaper: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  title: {
    position: "absolute",
    top: 40,
    left: 20,
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "PressStart2P_400Regular",
  },

  squareContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  square: {
    width: 90,
    height: 70,
    backgroundColor: "#8EDBE4",
    borderRadius: 10,
    paddingHorizontal: 10,
    elevation: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    borderRadius: 50,
    padding: 2,
  },
  squareText: {
    fontSize: 8,
    color: "white",
    fontFamily: "PressStart2P_400Regular",
    textAlign: "center",
  },
  recommendationsText: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 14,
    marginBottom: 10,
  },
  card: {
    width: 300,
    height: 200,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#CCCCCC",
    backgroundColor: "#FFFFFF",
    marginRight: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardImage: {
    width: "100%",
    height: "60%",
    resizeMode: "cover",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    filter: "saturate(0.5)", // Efek saturasi
    opacity: 0.8, // Opacity 0.8 (80% terlihat)
  },
  cardContent: {
    marginTop: 10,
    padding: 10,
  },
  cardText: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 12,
  },
});

export default HomeScreen;
