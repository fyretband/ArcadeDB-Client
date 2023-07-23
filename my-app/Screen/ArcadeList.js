import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
} from "react-native";
import { PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { fetchArcade, fetchArcadeGlobal } from "../Reducer/game";
import { ScrollView } from "react-native-gesture-handler";

const ScreenHeight = Dimensions.get("window").height;

const ArcadeList = () => {
  const storeArcades = useSelector((state) => state.arcades);
  const [arcades, setArcades] = useState([]);
  const [cutArcades, setCutArcades] = useState([]);
  const [global, setGlobal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchArcade());
      const temp = storeArcades[0]?.filter((arcade) => arcade.distance < 10);
      setArcades(temp);
      setCutArcades(temp);
    };
    fetchData();
  }, []);

  const navigation = useNavigation();

  const handleDetail = (id) => {
    navigation.navigate("ArcadeDetail", { id });
  };

  const handleGlobalSearch = () => {
    setGlobal(!global);
    if (!global) {
      setArcades(storeArcades[0]);
      setCutArcades(storeArcades[0]);
      const temp = storeArcades[0]?.filter((arcade) => arcade.distance < 10);
      setSearchResults(temp);
    } else {
      const temp = storeArcades[0]?.filter((arcade) => arcade.distance < 10);
      setArcades(temp);
      setCutArcades(temp);
      handleSearch();
    }
  };

  const handleSearch = () => {
    const results = cutArcades.filter((arcade) =>
      arcade.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={[styles.searchContainer, { marginTop: 50 }]}>
          <TextInput
            style={[
              styles.searchInput,
              { fontFamily: "PressStart2P_400Regular" },
            ]}
            placeholder="Search Arcade Location..."
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
        <TouchableOpacity
          style={styles.globalSearchButton}
          onPress={() => handleGlobalSearch()}
        >
          <Text
            style={[
              styles.globalSearchText,
              { fontFamily: "PressStart2P_400Regular" },
            ]}
          >
            Global Search
          </Text>
        </TouchableOpacity>
        {searchResults.length > 0 ? (
          searchResults.map((arcade) => (
            <TouchableOpacity
              onPress={() => handleDetail(arcade.id)}
              key={arcade.id}
            >
              <View style={styles.card}>
                <Image
                  source={{ uri: arcade.Brand.imageUrl }}
                  style={styles.cardImage}
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardText}>{arcade.name}</Text>
                  <Text style={styles.cardRating}>
                    {arcade.rating === 0 || arcade.rating === 100
                      ? "★★★★★"
                      : null}
                    {arcade.rating === 80 && "★★★★☆"}
                    {arcade.rating === 60 && "★★★☆☆"}
                    {arcade.rating === 40 && "★★☆☆☆"}
                    {arcade.rating === 20 && "★☆☆☆☆"}
                  </Text>
                  <Text style={styles.cardDistance}>
                    {Math.floor(arcade.distance)} km
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResultsText}>No results found</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FDF3E6",
    padding: 16,
  },
  searchContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
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
    position: "absolute",
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 10,
    right: 10,
  },
  iconImage: {
    width: 24,
    height: 20,
  },
  globalSearchButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 150,
    alignSelf: "flex-start",
  },
  globalSearchText: {
    color: "#6F6B65",
    fontSize: 10,
  },
  card: {
    width: "100%",
    height: 250,
    borderRadius: 15,
    backgroundColor: "#EFEFEF",
    marginRight: 10,
    marginTop: -100,
    marginBottom: 150,
    elevation: 4,
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
  cardRating: {
    fontSize: 14,
    color: "#FFD700",
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: "red",
    marginTop: 10,
    fontFamily: "PressStart2P_400Regular",
  },
});

export default ArcadeList;
