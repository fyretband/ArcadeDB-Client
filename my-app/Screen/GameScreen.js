import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  useFonts,
  PressStart2P_400Regular,
} from "@expo-google-fonts/press-start-2p";
import { useSelector, useDispatch } from "react-redux";
import { fetchArcade, fetchGame } from "../Reducer/game";
import HeaderAD from "../components/header";
import { useNavigation } from "@react-navigation/native";

const GameList = () => {
  const games = useSelector((state) => state.games);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const handleFetchGame = async () => {
      await dispatch(fetchGame());
    };
    handleFetchGame();
  }, []);

  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleCardPress = (gameId) => {
    // Navigasi ke halaman ArcadeList dengan game ID sebagai parameter
    navigation.navigate("Arcade List", { gameId });
    dispatch(fetchArcade);
  };

  return (
    <>
      <ScrollView>
        <View style={{ flex: 1 }}>
          <View style={{ height: 90, width: "100%" }}>
            <HeaderAD />
          </View>
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={[styles.title, { fontFamily: "PressStart2P_400Regular" }]}
            >
              Game List
            </Text>

            {games[0]?.map((game) => (
              <TouchableOpacity
                style={styles.card}
                key={game.id}
                onPress={() => handleCardPress(game.id)}
              >
                <Image
                  source={{ uri: game.logoUrl }}
                  style={styles.cardImage}
                  resizeMode="contain"
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{game.name}</Text>
                  <Text style={styles.cardText}>{game.genre}</Text>
                  <Text style={styles.cardText}>{game.platform}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
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
    color: "#6F6B65",
    fontSize: 16,

    marginBottom: 16,
    textAlign: "center",
    fontFamily: "PressStart2P_400Regular",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardImage: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    borderRadius: 10,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    marginTop: 50,
    fontSize: 16,
    color: "#000000",
    fontFamily: "PressStart2P_400Regular",
    marginBottom: 8,
    textAlignVertical: "center",
    marginLeft: 10,
  },

  cardText: {
    fontSize: 12,
    color: "#6F6B65",
    fontFamily: "PressStart2P_400Regular",
  },
});

export default GameList;
