import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { CheckBox } from "react-native-elements";
import { fetchGame, fetchBrand, fetchArcade } from "../Reducer/game";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { googleMapApi } from "../config/apiKey";
import { ScrollView } from "react-native-gesture-handler";
import * as Location from "expo-location";
import HeaderAD from "../components/header";
import axios from "axios";
import { BASE_URL } from "../config/api";
import { useNavigation } from "@react-navigation/native";
export default function AddArcade() {
  const [arcadeLocation, setArcadeLocation] = useState({});
  const [userLocation, setUserLocation] = useState({});
  const navigation = useNavigation();
  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      try {
        const location = await Location.getCurrentPositionAsync();
        const { latitude, longitude } = location.coords;
        console.log(location.coords);
        setUserLocation({
          userLat: latitude,
          userLong: longitude,
        });
      } catch (error) {
        console.log("Error while fetching location:", error);
      }
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const [selectedLogo, setSelectedLogo] = useState("");
  const [checkboxItems, setCheckboxItems] = useState([]);
  const games = useSelector((state) => state.games);
  const brands = useSelector((state) => state.brands);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGame());
    dispatch(fetchBrand());
  }, []);

  const handleLogoChange = (logo) => {
    setSelectedLogo(logo);
  };

  const handleCheck = (index) => {
    const updatedItems = [...checkboxItems];
    const checked = !updatedItems.includes(games[0][index].id);

    if (checked) {
      updatedItems.push(games[0][index].id);
    } else {
      const gameIndex = updatedItems.indexOf(games[0][index].id);
      if (gameIndex !== -1) {
        updatedItems.splice(gameIndex, 1);
      }
    }

    setCheckboxItems(updatedItems);
    console.log(updatedItems);
  };

  const handleSubmit = async () => {
    const formattedCheckboxItems = checkboxItems.map((id) => ({ id }));
    const data = {
      name: arcadeLocation.name,
      lat: arcadeLocation.latitude,
      lng: arcadeLocation.longitude,
      BrandId: selectedLogo,
      games: formattedCheckboxItems,
    };
    try {
      const response = await axios.post(`${BASE_URL}/arcades`, data);
      navigation.navigate("Arcade List");
      dispatch(fetchArcade);
      console.log("Arcade data submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting arcade data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.selectLabel, { marginTop: 70 }]}>
        Pick Location:
      </Text>
      <GooglePlacesAutocomplete
        placeholder="Search"
        fetchDetails={true}
        GooglePlacesSearchQuery={{
          rankby: "distance",
        }}
        onPress={(data, details = null) => {
          setArcadeLocation({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            name: data.structured_formatting.main_text,
          });
        }}
        query={{
          key: googleMapApi,
          language: "en",
          types: "establishment",
          radius: 30000,
          location: `${arcadeLocation.latitude}, ${arcadeLocation.longitude}`,
        }}
        styles={{
          container: {
            flex: 0,
            width: "100%",
            zIndex: 1,
            paddingHorizontal: 24,
          },
        }}
      />
      <ScrollView
        style={{
          paddingHorizontal: 24,
        }}
      >
        <View style={styles.selectContainer}>
          <Text style={styles.selectLabel}>Select Logo:</Text>
          <View style={styles.selectInput}>
            {brands[0]?.map((brand) => (
              <TouchableOpacity
                style={styles.logoOption}
                onPress={() => handleLogoChange(brand.id)}
                key={brand.id}
              >
                {selectedLogo === brand.id && (
                  <View style={styles.logoSelected} />
                )}
                <Text>{brand.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.tableContainer}>
          <Text style={styles.selectLabel}>Add Games:</Text>
          {games[0]?.map((game, index) => (
            <View style={styles.tableRow} key={index}>
              <CheckBox
                checked={checkboxItems.includes(game.id)}
                onPress={() => handleCheck(index)}
                checkedColor="#6F6B65"
              />
              <Text>{game.name}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF3E6",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    padding: 8,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 16,
  },
  selectContainer: {
    marginBottom: 24,
  },
  selectLabel: {
    fontSize: 16,
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  selectInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    padding: 8,
  },
  logoOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  logoSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#6F6B65",
    marginRight: 8,
  },
  tableContainer: {
    marginBottom: 16,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#6F6B65",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 50,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
