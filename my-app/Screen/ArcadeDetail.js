import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Dimensions,
	ScrollView,
	Image,
	Text,
	TouchableOpacity,
	Modal,
	TextInput,
	Button,
	Platform
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import { fetchArcade, fetchArcadeDetail } from "../Reducer/game";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../config/api";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DatePickerIOS } from "react-native";
import { Calendar } from "react-native-calendars";
import { Alert } from "react-native";

const { width, height } = Dimensions.get("window");

const ArcadeDetail = ({ route }) => {
	const { id } = route.params;

	const arcadesDetail = useSelector((state) => state.arcadesDetail);
	// const [arcadesDetail, setArcadesDetail] = useState([]);

	const dispatch = useDispatch();

	useEffect(() => {
		const handleArcadeDetail = async (id) => {
			await dispatch(fetchArcadeDetail(id));
		};
		handleArcadeDetail(id);

		fetchBookmarks();
	}, [id]);

	const arcade = arcadesDetail.find((arcade) => arcade.id === id);
	const initialLatitude = arcade ? arcade.lat : -6.2088;
	const initialLongitude = arcade ? arcade.lng : 106.8456;
	const [visible, setVisible] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedDate, setSelectedDate] = useState("");
	const [ratingModalVisible, setRatingModalVisible] = useState(false);
	const [selectedRating, setSelectedRating] = useState(0);
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [confirmationModalVisible, setConfirmationModalVisible] =
		useState(false);

	const handleBookButton = () => {
		setModalVisible(true);
	};
	const handleConfirmationModalOpen = () => {
		setConfirmationModalVisible(true);
	};

	const handleConfirmationModalClose = () => {
		setConfirmationModalVisible(false);
	};

	const handleConfirmationYes = async (arcadeGameId) => {
		// Handle the 'Yes' button action here
		console.log("ayo");
		try {
			const token = await AsyncStorage.getItem("access_token");
			const response = await axios.post(
				`${BASE_URL}/report/${arcadeGameId}`,
				{},
				{
					headers: {
						access_token: token
					}
				}
			);

			if (response.data.reportCount >= 5) {
				Alert.alert(
					"Game Deletion",
					"This game has received 5 or more reports and will be deleted.",
					[{ text: "OK", onPress: () => deleteGame() }]
				);
			} else {
				Alert.alert("Success", "Report submitted successfully.");
			}
		} catch (error) {
			console.error(error);
			Alert.alert(
				"Error",
				"An error occurred while submitting the report."
			);
		}

		// After handling the action, close the modal
		setConfirmationModalVisible(false);
	};

	const handleConfirmationNo = () => {
		// Handle the 'No' button action here
		// ...
		// After handling the action, close the modal
		setConfirmationModalVisible(false);
	};

	const handleModalClose = () => {
		setModalVisible(false);
	};

	// const handleDateChange = (date) => {
	//   setSelectedDate(date);
	//   console.log(date,'ini date')
	// };
	const handleDateChange = (date) => {
		setSelectedDate(date.dateString);
	};

	const handleRateButton = () => {
		setRatingModalVisible(true);
	};

	const handleRatingModalClose = () => {
		setRatingModalVisible(false);
	};

	const handleRatingSelect = async (rating) => {
		try {
			const token = await AsyncStorage.getItem("access_token");
			const config = {
				headers: {
					access_token: token
				}
			};
			const response = await axios.post(
				`${BASE_URL}/rate/${id}`,
				{ rating },
				config
			);

			console.log(config);
			console.log("Rating submitted successfully");
			setRatingModalVisible(false);
		} catch (error) {
			console.log("Error submitting rating", error);
		}
	};
	const [bookmarks, setBookmarks] = useState([]);
	const fetchBookmarks = async () => {
		try {
			const token = await AsyncStorage.getItem("access_token");

			if (token) {
				const config = {
					headers: {
						access_token: token
					}
				};

				const response = await axios.get(
					`${BASE_URL}/bookmarks`,
					config
				);

				setBookmarks(response.data.Bookmark);
			} else {
				console.log("Token not found");
			}
		} catch (error) {
			console.log("Error fetching bookmarks", error);
		}
	};

	const addBookmark = async () => {
		try {
			const token = await AsyncStorage.getItem("access_token");

			if (token) {
				const config = {
					headers: {
						access_token: token
					}
				};

				const response = await axios.post(
					`${BASE_URL}/bookmarks/${id}`,
					null,
					config
				);
				// Handle the response, update the bookmark state, or perform any other necessary actions
				console.log("Bookmark added successfully");
				setIsBookmarked(true);
			} else {
				// Handle the case when the token is not available in AsyncStorage
				console.log("Token not found");
			}
		} catch (error) {
			// Handle any errors that occur during the bookmark addition
			console.log("Error adding bookmark", error);
		}
	};

	const handleBook = async () => {
		try {
			const token = await AsyncStorage.getItem("access_token");

			if (token) {
				const config = {
					headers: {
						access_token: token
					}
				};

				const response = await axios.post(
					`${BASE_URL}/session/add/${id}`,
					{
						date: selectedDate // Pass the selected date to the request body
					},
					config
				);

				// Handle the response, such as showing a success message or navigating to a different screen
				console.log("Session added successfully", response.data);
				a++;
				await dispatch(fetchArcadeDetail(id));
			} else {
				console.log("Token not found");
				// Handle the case when the token is not available in AsyncStorage
			}
		} catch (error) {
			console.log("Error adding session", error);
			// Handle any errors that occur during the session addition
		}
	};
	const ratingMap = {
		5: "★★★★★",
		4: "★★★★",
		3: "★★★",
		2: "★★",
		1: "★",
		0: "No rating yet"
	};

	return (
		<ScrollView contentContainerStyle={styles.scrollContainer}>
			<View style={styles.container} key={arcadesDetail[0]?.id}>
				<MapView
					style={styles.map}
					initialRegion={{
						latitude: initialLatitude,
						longitude: initialLongitude,
						latitudeDelta: 0.01,
						longitudeDelta: 0.01
					}}
				>
					<Marker
						coordinate={{
							latitude: initialLatitude,
							longitude: initialLongitude
						}}
						title={arcadesDetail[0]?.name}
					/>
				</MapView>
				<View style={[styles.card, styles.bigCard]}>
					<View style={styles.headerContainer}>
						<Text style={styles.arcadeName}>
							{arcadesDetail.find((arcade) => arcade.id === id)
								?.name || ""}
						</Text>
						<Text style={styles.arcadeName}>
							{/* {arcadesDetail.find((arcade) => arcade.id === id)
								?.id || ""} */}
						</Text>
						<View style={styles.rateContainer}>
							<Text style={[styles.rateText, {color:"orange"}]}>
								{(() => {
									const rating = arcadesDetail.find(
										(arcade) => arcade.id === id
									)?.rating;

									return ratingMap[Math.floor(rating)]
								})()}
							</Text>
						</View>
					</View>

					<View style={styles.buttonContainer}>
						<TouchableOpacity
							style={[styles.bookButton, { marginRight: 10 }]}
							onPress={handleBookButton}
						>
							<Text style={styles.buttonText}>Book</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={addBookmark}
							style={
								isBookmarked
									? styles.bookmarkButtonActive
									: styles.bookmarkButton
							}
						>
							<Text
								style={
									isBookmarked
										? styles.bookmarkTextActive
										: styles.bookmarkText
								}
							>
								{isBookmarked ? "Bookmarked" : "Bookmark"}
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.rateButton, { marginRight: 10 }]}
							onPress={handleRateButton}
						>
							<Text style={styles.rateButtonText}>Rate</Text>
						</TouchableOpacity>
					</View>

					{Object.entries(arcade?.Session)
						.slice(0, 7)
						.map(([key, value]) => (
							<View key={key} style={styles.circleContainer}>
								{/* <Text>{JSON.stringify(arcadesDetail)}</Text> */}
								{value.map((user, index) => (
									<Image
										key={index}
										source={require("../assets/image/images.jpeg")}
										style={[
											styles.circle,
											styles[`circle${index + 1}`]
										]}
									/>
								))}
								<Text style={{ marginLeft: 50 }}>
									{value
										.map((user) =>
											JSON.stringify(user.User.username)
										)
										.join(" and ")}{" "}
									playing on {key}
								</Text>
							</View>
						))}
				</View>
				<View style={[styles.smallSquareRow, styles.smallCardRow]}>
					{arcade?.ArcadeGame?.map((arcade) => (
						<View
							key={arcade.Game.id}
							style={[styles.smallCard, styles.smallCardMargin]}
						>
							<Image
								source={{ uri: arcade.Game.logoUrl }}
								style={styles.smallCardImage}
							/>
							<Text style={{ textAlign: "center" }}>
								{arcade.Game.name}
							</Text>
							<TouchableOpacity
								style={styles.rateGameButton}
								onPress={handleConfirmationModalOpen}
							>
								<Text style={styles.rateButton2Text}>
									Inacurate
								</Text>
							</TouchableOpacity>
						</View>
					))}
				</View>

				<Modal
					visible={modalVisible}
					animationType="slide"
					transparent={true}
					onRequestClose={handleModalClose}
				>
					<View style={styles.modalContainer}>
						<View style={styles.modalContent}>
							{/* {renderDatePicker()} */}
							<Calendar
								onDayPress={handleDateChange}
								markedDates={{
									[selectedDate]: {
										selected: true,
										selectedColor: "blue"
									}
								}}
							/>
							<Button title="Book" onPress={handleBook} />
							<Button title="Close" onPress={handleModalClose} />
						</View>
					</View>
				</Modal>
				<Modal
					visible={confirmationModalVisible}
					animationType="slide"
					transparent={true}
					onRequestClose={handleConfirmationModalClose}
				>
					<View style={styles.modalContainer}>
						<View style={styles.modalContent}>
							<Text style={styles.modalText}>
								{" "}
								is this game unavailable here?
							</Text>
							<View style={styles.buttonContainer}>
								<TouchableOpacity
									style={styles.button}
									onPress={() => handleConfirmationYes(id)}
								>
									<Text style={styles.buttonText}>Yes</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.button}
									onPress={handleConfirmationNo}
								>
									<Text style={styles.buttonText}>No</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>

				{/* Button to open the modal */}

				<Modal
					visible={ratingModalVisible}
					animationType="slide"
					transparent={true}
					onRequestClose={handleRatingModalClose}
				>
					<View style={styles.modalContainer}>
						<View style={styles.modalContent}>
							<Text style={styles.modalText}>
								Rate this arcade:
							</Text>
							<View style={styles.ratingContainer}>
								{[1, 2, 3, 4, 5].map((rating) => (
									<TouchableOpacity
										key={rating}
										style={styles.starButton}
										onPress={() =>
											handleRatingSelect(rating)
										}
									>
										<Text style={styles.starText}>
											{rating}
										</Text>
									</TouchableOpacity>
								))}
							</View>
							<Button
								title="Close"
								onPress={handleRatingModalClose}
							/>
						</View>
					</View>
				</Modal>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	scrollContainer: {
		flexGrow: 1,
		backgroundColor: "#FDF3E6"
	},
	container: {
		flex: 1
	},
	map: {
		width: width,
		height: height / 3
	},
	card: {
		width: "90%",
		height: "auto",
		backgroundColor: "white",
		alignSelf: "center",
		marginTop: 20,
		borderWidth: 2,
		borderColor: "black",
		paddingHorizontal: 10,
		paddingTop: 10,
		paddingBottom: 10
	},
	bigCard: {
		marginBottom: 20
	},
	headerContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	arcadeName: {
		fontSize: 20,
		fontWeight: "bold"
	},
	rateContainer: {
		flexDirection: "row",
		alignItems: "center"
	},
	rateText: {
		fontSize: 16,
		fontWeight: "bold",
		marginRight: 5
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 10
	},
	rateButton: {
		backgroundColor: "#FDF3E6",
		borderRadius: 5,
		marginBottom: 10,
		height: 20,
		width: 80,
		marginTop: 5,
		marginLeft: "auto",
		marginRight: "auto",
		display: "flex"
	},
	rateGameButton: {
		backgroundColor: "gray",
		borderRadius: 5,
		marginBottom: 10,
		height: 20,
		width: 80,
		marginTop: 5,
		marginLeft: "auto",
		marginRight: "auto",
		display: "flex"
	},
	rateButtonText: {
		color: "black",
		fontWeight: "bold",
		fontSize: 12,
		textAlign: "center"
	},
	rateButton2Text: {
		color: "white",
		fontWeight: "bold",
		fontSize: 12,
		textAlign: "center"
	},
	bookButton: {
		backgroundColor: "#FDF3E6",
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 5
	},
	buttonText: {
		color: "black",
		fontWeight: "bold",
		fontSize: 16
	},
	userScheduleContainer: {
		marginTop: 10
	},
	userScheduleText: {
		fontWeight: "bold"
	},
	circleContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 50,
		marginBottom: 10
	},
	circle: {
		width: 45,
		height: 45,
		borderRadius: 100
	},
	circle1: {
		position: "absolute",
		zIndex: 3,
		marginLeft: 0,
		borderWidth: 3,
		borderColor: "white"
	},
	circle2: {
		position: "absolute",
		zIndex: 2,
		marginLeft: 20,
		borderWidth: 3,
		borderColor: "white"
	},
	circle3: {
		position: "absolute",
		zIndex: 1,
		marginLeft: 40,
		borderWidth: 3,
		borderColor: "white"
	},
	smallSquareContainer: {
		width: "90%",
		height: 150,
		alignSelf: "center"
	},
	smallSquareRow: {
		width: "90%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignSelf: "center",
		overflow: "hidden"
	},
	smallSquareRow: {
		width: "90%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignSelf: "center",
		flexWrap: "wrap"
	},
	smallCard: {
		width: "45%",
		height: 120,
		backgroundColor: "white",
		borderWidth: 2,
		borderColor: "black",
		paddingTop: 10,
		marginBottom: 10
	},
	smallCardImage: {
		width: "100%",
		height: 60,
		alignSelf: "center",
		marginBottom: 10
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)"
	},
	modalContent: {
		width: "80%",
		backgroundColor: "white",
		padding: 20,
		borderRadius: 10
	},
	modalText: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10
	},
	input: {
		borderWidth: 1,
		borderColor: "black",
		padding: 10,
		marginBottom: 10
	},
	ratingContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginBottom: 10
	},
	starButton: {
		marginHorizontal: 5,
		padding: 5,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: "black"
	},
	starText: {
		fontSize: 16,
		fontWeight: "bold"
	},
	bookmark: {
		fontWeight: "bold",
		color: "gray",
		marginTop: 5
	},
	bookmarkButton: {
		backgroundColor: "#FDF3E6",
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 5,
		borderColor: "black",
		alignSelf: "flex-start"
	},
	bookmarkTextActive: {
		color: "red", // Ubah warna teks sesuai kebutuhan Anda
		fontSize: 14, // Ubah ukuran teks sesuai kebutuhan Anda
		fontWeight: "bold" // Ubah gaya teks sesuai kebutuhan Anda
	},
	bookmarkButtonActive: {
		backgroundColor: "green",
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 5,

		borderColor: "black",
		alignSelf: "flex-start"
	},
	bookmarkText: {
		color: "black",
		fontWeight: "bold",
		fontSize: 14
	},
	bookmarkActive: {
		fontWeight: "bold",
		color: "green",
		marginTop: 5
	}
});

export default ArcadeDetail;
