import React, { useCallback, useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TextInput,
	TouchableOpacity
} from "react-native";
import axios from "axios";
import arcadeImage from "../assets/image/imagesArcade.png";
import HeaderAD from "../components/header";
import { BASE_URL } from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";

const MessageScreen = ({ route }) => {
	const [messages, setMessages] = useState([]);
	const [messageText, setMessageText] = useState("");
	const [fontsLoaded] = useFonts({
		PressStart2P_400Regular
	});
	const { message } = route.params;
	// console.log(message, "<<<<");

	const navigation = useNavigation();

	const fetchChat = useCallback(async (token, id) => {
		try {
			const { data } = await axios.get(`${BASE_URL}/chat/${id}`, {
				headers: {
					access_token: token
				}
			});
			console.log(data);

			if (data && data.messages) {
				const messageArray = Object.values(data.messages);
				return messageArray;
			}

			return [];
		} catch (error) {
			console.log(error);
			return [];
		}
	}, []);

	useFocusEffect(
		useCallback(() => {
			const fetchData = async () => {
				try {
					const token = await AsyncStorage.getItem("access_token");
					const id = await AsyncStorage.getItem("id");
					const targetId =
						message.senderId === id
							? message.senderId
							: message.receiverId;
					const response = await fetchChat(token, targetId);
					setMessages(response);
				} catch (error) {
					console.log(error);
				}
			};

			fetchData();
		}, [message, fetchChat])
	);

	const sendMessage = async () => {
		try {
			const token = await AsyncStorage.getItem("access_token");
			const id = await AsyncStorage.getItem("id");
			const targetId =
				message.senderId === id ? message.senderId : message.receiverId;
			console.log(targetId);
			const response = await axios.post(
				`${BASE_URL}/sendMessage`,
				{
					message: messageText,
					receiverId: JSON.stringify(targetId)
				},
				{
					headers: {
						access_token: token
					}
				}
			);
			const chatUpdate = await fetchChat(token, targetId);
			setMessages(chatUpdate);
			// if (response.data && response.data.message) {
			// 	setMessages([...messages, response.data.message]);
			// 	setMessageText("");
			// }
		} catch (error) {
			console.log(error);
		}
	};

	// Render item pada daftar pesan
	const renderItem = ({ item }) => {
		return (
			<View
				style={[
					styles.messageContainer,
					item.asSender
						? styles.senderContainer
						: styles.receiverContainer
				]}
			>
				{item.asSender ? (
					<View style={{ flex: 1 }} /> // Mengisi ruang kosong di sebelah kiri pengirim
				) : (
					<Image
						source={arcadeImage}
						style={[styles.profileImage, { marginLeft: 8 }]}
					/>
				)}
				<View>
					<Text style={styles.sender}>
						{item.asSender ? "You" : "Sender"}
					</Text>
					<Text style={styles.message}>{item.message}</Text>
				</View>
				{item.asSender ? (
					<Image
						source={arcadeImage}
						style={[styles.profileImage, { marginRight: 20 }]}
					/>
				) : (
					<View style={{ flex: 1 }} /> // Mengisi ruang kosong di sebelah kanan penerima
				)}
			</View>
		);
	};

	return (
		<>
			<View style={styles.container}>
				<FlatList
					data={messages}
					renderItem={renderItem}
					keyExtractor={(item, index) => index.toString()}
				/>
				<View style={styles.inputContainer}>
					<TextInput
						style={styles.input}
						value={messageText}
						onChangeText={setMessageText}
						placeholder="Type a message..."
						placeholderTextColor="#BBBBBB"
						underlineColorAndroid="transparent"
					/>
					<TouchableOpacity
						style={styles.sendButton}
						onPress={sendMessage}
					>
						<Text style={styles.sendButtonText}>Send</Text>
					</TouchableOpacity>
				</View>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FDF3E6",
		paddingHorizontal: 16,
		paddingTop: 36
	},
	senderContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16
	},
	receiverContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end",
		marginBottom: 16
	},
	profileImage: {
		width: 50,
		height: 50,
		borderRadius: 25
	},
	messageContainer: {
		maxWidth: "100%",
		borderRadius: 20,
		padding: 8,
		backgroundColor: "#ffffff"
	},
	sender: {
		fontSize: 14,
		fontWeight: "bold",
		marginBottom: 4,
		color: "#1877F2"
	},
	message: {
		fontSize: 12,
		color: "#555555"
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderTopWidth: 1,
		borderTopColor: "#EAEAEA",
		marginBottom: 50
	},
	input: {
		flex: 1,
		height: 40,
		borderWidth: 1,
		backgroundColor: "white",
		borderColor: "#EAEAEA",
		borderRadius: 20,
		paddingHorizontal: 16,
		marginRight: 8,
		fontSize: 14,
		color: "#555555"
	},
	sendButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		backgroundColor: "#1877F2",
		borderRadius: 20
	},
	sendButtonText: {
		fontSize: 14,
		fontWeight: "bold",
		color: "#FFFFFF"
	}
});

export default MessageScreen;
