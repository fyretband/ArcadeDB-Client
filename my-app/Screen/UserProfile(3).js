import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Linking,
  Platform,
} from "react-native";
import ImagePicker from "react-native-image-picker";
import userImage from "../assets/image/user3.png";
import bannerImage from "../assets/image/imagesArcade.png";
import HeaderAD from "../components/header";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { fetchBrand } from "../Reducer/game";
import { BASE_URL } from "../config/api";
import { WebView } from "react-native-webview";
import axios from "axios";
// import * as Linking from "expo-linking";

Linking.addEventListener();
// import MidtransPayment from "react-native-midtrans-payment";

const UserProfile = () => {
  const [selectedLogo, setSelectedLogo] = useState("");
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subProcess, setSubProcess] = useState({
    pending: false,
    paid: false,
    redirect_url: null,
  });
  const brands = useSelector((state) => state.brands);

  const dispatch = useDispatch();
  const handleLogoChange = (logo) => {
    setSelectedLogo(logo);
  };
  useEffect(() => {
    dispatch(fetchBrand());
  }, []);
  useFocusEffect(
    useCallback(() => {
      setSubProcess({
        ...subProcess,
        pending: false,
      });
      console.log(subProcess);
    }, [])
  );
  const handlePage = (page) => {
    navigation.navigate(page);
  };

  const handleEditUser = () => {
    setModalVisible(true);
  };

  const handleSaveUser = () => {
    // Code to save the updated user profile
    setModalVisible(false);
  };
  const handleProfileImagePress = () => {
    setModalVisible(true);
  };
  const handleSelectProfileImage = () => {
    const options = {
      title: "Select Profile Image",
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        // Set the selected image as profilePicture state
        setProfilePicture(response.uri);
      }
    });
  };
  const handleCloseMidtrans = () => {
    navigation("Dashboard");
  };

  const clearAccessToken = async () => {
    try {
      await AsyncStorage.removeItem("access_token");
      navigation.navigate("Dashboard");
      console.log("Access token cleared successfully");
    } catch (error) {
      console.log("Error clearing access token", error);
    }
  };

  const handleLogout = () => {
    clearAccessToken();
    navigation.navigate("Login");
  };

  // ...

  const buySubscription = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      if (token) {
        const config = {
          headers: {
            access_token: token,
          },
        };

        // Step 1: Get Midtrans Token from your server using GET request
        const { data } = await axios.get(`${BASE_URL}/midtrans`, config);
        const { redirect_url } = data;
        console.log(data, "<<<<<<<<<<<<<<Midtans server");
        setSubProcess({
          ...subProcess,
          pending: true,
          redirect_url,
        });

        // Step 2: Process Payment using the obtained midtransToken
        // const paymentResult = await MidtransPayment.startPayment({
        //   clientKey: "SB-Mid-server-_8c1DQYqomT2roIxrzfzMs68",
        //   baseUrl:
        //     "https://app.sandbox.midtrans.com/snap/v3/redirection/9e9b8696-28df-4691-85ed-12d278934b18",
        //   snapToken: midtransToken.token, // Use the token property from the response
        // });

        // if (paymentResult) {
        //   // Step 3: Update User's Subscription Status using PATCH request
        //   const updateSubscriptionResponse = await axios.patch(
        //     `${BASE_URL}/subscriptions/createSub`,
        //     {},
        //     config
        //   );

        //   if (updateSubscriptionResponse.status === 200) {
        //     // Handle the success case
        //     console.log("Subscription purchased successfully");
        //     setIsSubscribed(true);
        //   } else {
        //     // Handle the case when updating subscription status fails
        //     console.log("Error updating subscription status");
        //   }
        // } else {
        //   // Handle the case when the payment fails
        //   console.log("Payment failed");
        // }
      } else {
        // Handle the case when the token is not available in AsyncStorage
        console.log("Token not found");
      }
    } catch (error) {
      // Handle any errors that occur during the subscription purchase
      console.log("Error purchasing subscription", error);
    }
  };
  if (subProcess.pending) {
    return (
      <>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.subscriptionButton]}
            onPress={handleCloseMidtrans}
          >
            <Text style={styles.buttonText}>{JSON.stringify(subProcess)}</Text>
          </TouchableOpacity>
        </View>
        <WebView
          source={{ uri: subProcess.redirect_url }}
          style={{ marginTop: 20 }}
        ></WebView>
      </>
    );
  }
  return (
    <>
      <View style={{ height: 90, width: "100%" }}>
        <HeaderAD />
      </View>
      <View style={styles.container}>
        <View style={styles.bannerContainer}>
          <Image source={bannerImage} style={styles.bannerImage} />
        </View>
        <View style={styles.profileContainer}>
          <View style={styles.profileCard}>
            <TouchableOpacity
              style={styles.profileImageContainer}
              onPress={handleProfileImagePress}
            >
              {profilePicture ? (
                <Image
                  source={{ uri: profilePicture }}
                  style={styles.profileImage}
                />
              ) : (
                <Image source={userImage} style={styles.profileImage} />
              )}
            </TouchableOpacity>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName} numberOfLines={2}>
                Bagas Tama Putra
              </Text>
              <View style={styles.statsContainer}>
                <TouchableOpacity
                  style={styles.stat}
                  onPress={() => handlePage("Follower")}
                >
                  <Text style={styles.statValue}>1k</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.stat}
                  onPress={() => handlePage("Following")}
                >
                  <Text style={styles.statValue}>1.5k</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.premiumStatus}>Premium User</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}></View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.subscriptionButton]}
              onPress={buySubscription}
            >
              <Text style={styles.buttonText}>Buy Subscription</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Text style={styles.buttonLogOutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change profile picture</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
            <View style={styles.modalForm}>
              <View style={styles.modalLabelContainer}>
                <Text style={styles.modalLabel}>Profile Picture:</Text>
                <View style={styles.profileImageContainerAll}>
                  <TouchableOpacity
                    style={styles.modalProfileContainer}
                    onPress={handleSelectProfileImage}
                  >
                    {profilePicture ? (
                      <Image
                        source={{ uri: profilePicture }}
                        style={styles.modalProfileImage}
                      />
                    ) : (
                      <Image
                        source={userImage}
                        style={styles.modalProfileImage}
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalProfileContainer}
                    onPress={handleSelectProfileImage}
                  >
                    {profilePicture ? (
                      <Image
                        source={{ uri: profilePicture }}
                        style={styles.modalProfileImage}
                      />
                    ) : (
                      <Image
                        source={userImage}
                        style={styles.modalProfileImage}
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalProfileContainer}
                    onPress={handleSelectProfileImage}
                  >
                    {profilePicture ? (
                      <Image
                        source={{ uri: profilePicture }}
                        style={styles.modalProfileImage}
                      />
                    ) : (
                      <Image
                        source={userImage}
                        style={styles.modalProfileImage}
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalProfileContainer}
                    onPress={handleSelectProfileImage}
                  >
                    {profilePicture ? (
                      <Image
                        source={{ uri: profilePicture }}
                        style={styles.modalProfileImage}
                      />
                    ) : (
                      <Image
                        source={userImage}
                        style={styles.modalProfileImage}
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalProfileContainer}
                    onPress={handleSelectProfileImage}
                  >
                    {profilePicture ? (
                      <Image
                        source={{ uri: profilePicture }}
                        style={styles.modalProfileImage}
                      />
                    ) : (
                      <Image
                        source={userImage}
                        style={styles.modalProfileImage}
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalProfileContainer}
                    onPress={handleSelectProfileImage}
                  >
                    {profilePicture ? (
                      <Image
                        source={{ uri: profilePicture }}
                        style={styles.modalProfileImage}
                      />
                    ) : (
                      <Image
                        source={userImage}
                        style={styles.modalProfileImage}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSaveUser}
              >
                <Text style={styles.modalSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF3E6",
  },
  profileContainer: {
    marginTop: -80,
    paddingHorizontal: 20,
  },
  bannerContainer: {
    height: 200,
    backgroundColor: "#1877F2",
    marginBottom: 20,
  },
  bannerImage: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    elevation: 2,
  },
  profileImageContainer: {
    borderRadius: 100,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#1877F2",
    marginTop: -20,
  },
  profileImage: {
    width: 100,
    height: 100,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "gray",
  },
  premiumStatus: {
    marginTop: 10,
    fontSize: 16,
    color: "#1877F2",
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#1877F2",
    borderRadius: 15,
    paddingVertical: 10,
    marginHorizontal: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#1877F2",
  },
  subscriptionButton: {
    backgroundColor: "#E6B325",
  },
  logoutButton: {
    backgroundColor: "#FFffff",
    borderWidth: 2,
    borderColor: "gray",
  },
  buttonLogOutText: {
    color: "gray",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalCloseButton: {
    alignSelf: "flex-end",
    padding: 5,
  },
  modalCloseButtonText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalForm: {
    marginTop: 20,
  },
  modalLabelContainer: {
    marginBottom: 20,
    flexDirection: "column",
    alignItems: "center",
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  profileImageContainerAll: {
    marginTop: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalProfileContainer: {
    borderRadius: 100,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#1877F2",
  },
  modalProfileImage: {
    width: 80,
    height: 80,
  },
  modalSaveButton: {
    backgroundColor: "#1877F2",
    borderRadius: 15,
    paddingVertical: 10,
    alignItems: "center",
  },
  modalSaveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UserProfile;
