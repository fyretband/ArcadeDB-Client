import { AsyncStorage } from "react-native";

// Menyimpan data login ke local storage
export const saveLoginData = async (data) => {
  try {
    await AsyncStorage.setItem("loginData", JSON.stringify(data));
    console.log("Data login berhasil disimpan");
  } catch (error) {
    console.error("Gagal menyimpan data login:", error);
  }
};

// Mengambil data login dari local storage
export const getLoginData = async () => {
  try {
    const loginData = await AsyncStorage.getItem("loginData");
    if (loginData !== null) {
      return JSON.parse(loginData);
    }
    return null;
  } catch (error) {
    console.error("Gagal mengambil data login:", error);
    return null;
  }
};

// Menghapus data login dari local storage
export const removeLoginData = async () => {
  try {
    await AsyncStorage.removeItem("loginData");
    console.log("Data login berhasil dihapus");
  } catch (error) {
    console.error("Gagal menghapus data login:", error);
  }
};

//
