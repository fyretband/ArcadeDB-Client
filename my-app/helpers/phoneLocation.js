import * as Location from "expo-location";

export default async function phoneLocation() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;
      const data = {
        userLat: latitude,
        userLong: longitude,
      };
      console.log(data);
      return data;
    }
  } catch (error) {
    console.log("Error while fetching location:", error);
  }
}
