import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import userImage from "../assets/image/user3.png";
import bannerImage from "../assets/image/imagesArcade.png";
import HeaderAD from "../components/header";
import {
	useFocusEffect,
	useNavigation,
	useRoute
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../config/api";
const OtherProfile = () => {
	const navigation = useNavigation();
	const handlePage = (page, id) => {
		navigation.navigate(page, {id});
	};
	const route = useRoute();
	const [userData, setUserData] = useState({}); // Tambah state userData
	const [profilePicture, setProfilePicture] = useState({});
	const [hasFollowed, setHasFollowed] = useState(false);
	const id = route.params;

	useFocusEffect(
		useCallback(() => {
			fetchUserData();
      console.log(hasFollowed.hasFollowed);
		}, [])
	);
	const fetchUserData = async () => {
		try {
			const id = route.params;
			const token = await AsyncStorage.getItem("access_token");
			const response = await axios.get(`${BASE_URL}/users/${id}`, {
				headers: { access_token: token }
			});
			const { data: followStatus } = await axios.get(
				`${BASE_URL}/hasfollowed/${id}`,
				{
					headers: { access_token: token }
				}
			);
			setUserData(response.data);
			setProfilePicture(response.data.ProfilePicture);
			setHasFollowed(followStatus);
      console.log(hasFollowed);
		} catch (error) {
			console.error("Error fetching user data:", error);
		}
	};
	const handleFollow = async (id) => {
		try {
			// const { id: FollowedId } = route.params; // Ambil id dari parameter rute
			const token = await AsyncStorage.getItem("access_token");
			const response = await axios.post(
				`${BASE_URL}/follow/${id}`,
				null,
				{
					headers: { access_token: token }
				}
			);
			console.log(response.data); // Outputkan respons dari server
			// Lakukan tindakan lain setelah mengikuti pengguna
			setUserData({
				...userData,
				followerCount: userData.followerCount + 1
			});
			fetchUserData();
		} catch (error) {
			console.error("Error following user:", error);
		}
	};
	const handleUnfollow = async (id) => {
		try {
			// const { id: FollowedId } = route.params; // Ambil id dari parameter rute
			const token = await AsyncStorage.getItem("access_token");
			const response = await axios.delete(`${BASE_URL}/follow/${id}`, {
				headers: { access_token: token }
			});
			console.log(response.data); // Outputkan respons dari server
			// Lakukan tindakan lain setelah mengikuti pengguna
			setUserData({
				...userData,
				followerCount: userData.followerCount - 1
			});
			fetchUserData();
      setHasFollowed(false);
		} catch (error) {
			console.error("Error following user:", error);
		}
	};
	const handleChat = () => {
		console.log("Chat button pressed");
	};
	const handlePressMessage = () => {
		navigation.navigate("Message", { id });
	};

	return (
		<>
			<View style={styles.container}>
				<View style={styles.bannerContainer}>
					<Image source={bannerImage} style={styles.bannerImage} />
				</View>
				<View style={styles.profileContainer}>
					<View style={styles.profileCard}>
						<View style={styles.profileImageContainer}>
							<Image
								source={{ uri: profilePicture.imageUrl }}
								style={styles.profileImage}
							/>
						</View>
						<View style={styles.profileInfo}>
							<Text style={styles.profileName} numberOfLines={2}>
								{userData.username}{" "}
								{/* Tampilkan nama pengguna */}
							</Text>
							<View style={styles.statsContainer}>
								<TouchableOpacity
									style={styles.stat}
									onPress={() => handlePage("Follower", userData.id)}
								>
									<Text style={styles.statValue}>
										{userData.followerCount}
									</Text>
									<Text style={styles.statLabel}>
										Followers
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.stat}
									onPress={() => handlePage("Following", userData.id)}
								>
									<Text style={styles.statValue}>
										{userData.followingCount}
									</Text>
									<Text style={styles.statLabel}>
										Following
									</Text>
								</TouchableOpacity>
							</View>
							<View style={styles.buttonContainer}>
								{!hasFollowed.hasFollowed && (
									<TouchableOpacity
										style={[
											styles.button,
											styles.followButton
										]}
										onPress={() => handleFollow(id)}
									>
										<Text style={styles.buttonText}>
											Follow
										</Text>
									</TouchableOpacity>
								)}
								{hasFollowed.hasFollowed && (
									<TouchableOpacity
										style={[
											styles.button,
											styles.followButton,
											{ backgroundColor: "red" }
										]}
										onPress={() => handleUnfollow(id)}
									>
										<Text style={styles.buttonText}>
											Unfollow
										</Text>
									</TouchableOpacity>
								)}
								<TouchableOpacity
									style={[styles.button, styles.chatButton]}
									onPress={handleChat}
								>
									<Text
										style={styles.buttonText}
										onPress={() => handlePressMessage()}
									>
										Chat
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FDF3E6"
	},
	profileContainer: {
		marginTop: -80,
		paddingHorizontal: 20
	},
	bannerContainer: {
		height: 200,
		backgroundColor: "#1877F2",
		marginBottom: 20,
		marginTop: 50
	},
	bannerImage: {
		flex: 1,
		resizeMode: "cover",
		width: "100%"
	},
	profileCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 15,
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
		elevation: 2
	},
	profileImageContainer: {
		borderRadius: 100,
		overflow: "hidden",
		borderWidth: 3,
		borderColor: "#1877F2",
		marginTop: -50
	},
	profileImage: {
		width: 100,
		height: 100
	},
	profileInfo: {
		flex: 1,
		marginLeft: 20
	},
	profileName: {
		fontSize: 24,
		fontWeight: "bold"
	},
	statsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 5
	},
	stat: {
		alignItems: "center"
	},
	statValue: {
		fontSize: 18,
		fontWeight: "bold"
	},
	statLabel: {
		fontSize: 14,
		color: "gray"
	},
	premiumStatus: {
		marginTop: 10,
		fontSize: 16,
		color: "#1877F2",
		fontWeight: "bold"
	},
	buttonContainer: {
		marginTop: 20,
		flexDirection: "row",
		justifyContent: "space-between"
	},
	button: {
		backgroundColor: "#1877F2",
		borderRadius: 15,
		paddingVertical: 10,

		alignItems: "center",
		width: 75
	},
	buttonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "bold"
	},
	followButton: {
		backgroundColor: "#1877F2"
	},
	chatButton: {
		backgroundColor: "#FCAF17"
	}
});

export default OtherProfile;
