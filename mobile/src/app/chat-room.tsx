import { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Platform, Image, Keyboard, KeyboardAvoidingView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { TRANSLATIONS } from "../constants/languages";
import { API_ENDPOINTS } from "../constants/api";
import { styles } from "../components/chat-room.styles";

interface Message {
	id: string;
	text: string;
	sender: "me" | "other";
	time: string;
}

export default function ChatRoomScreen() {
	const router = useRouter();
	const { name, avatar, chatId, currentUserId } = useLocalSearchParams<{
		name: string;
		avatar: string;
		chatId: string;
		currentUserId: string;
	}>();

	const [lang] = useState<"en" | "os">("os");
	const t = TRANSLATIONS[lang];

	const [messages, setMessages] = useState<Message[]>([]);
	const [inputText, setInputText] = useState("");
	const [userStatus, setUserStatus] = useState<string>(t.online);

	const scrollViewRef = useRef<ScrollView>(null);
	const wsRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
		const subscription = Keyboard.addListener(showEvent, () => {
			setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
		});
		return () => subscription.remove();
	}, []);

	useEffect(() => {
		const activeChatId = chatId || "demo_room";
		const isAndroid = Platform.OS === "android";
		const activeUserId =
			currentUserId && currentUserId !== "test_current_id" && currentUserId !== "fallback_me_id"
				? currentUserId
				: isAndroid
					? "id_aslan_test"
					: "id_alan_test";

		const wsUrl = API_ENDPOINTS.WS || "ws://127.0.0.1:5050/ws";
		const ws = new WebSocket(wsUrl);
		wsRef.current = ws;

		ws.onopen = () => {
			ws.send(
				JSON.stringify({
					type: "JOIN_CHAT",
					chatId: activeChatId,
					senderId: activeUserId,
				}),
			);
		};

		ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				if (data.type === "RECEIVE_MESSAGE") {
					const isFromMe = data.senderId === activeUserId;
					if (!isFromMe) {
						const incomingMsg: Message = {
							id: data.id || Date.now().toString(),
							text: data.text,
							sender: "other",
							time: data.time,
						};
						setMessages((prev) => [...prev, incomingMsg]);
					}
				}

				if (data.type === "USER_STATUS_UPDATE" && data.senderId !== activeUserId) {
					if (data.status === "typing") {
						setUserStatus(lang === "os" ? "фыссы... ✍️" : "typing... ✍️");
					} else if (data.status === "recording") {
						setUserStatus(lang === "os" ? "хъӕл фыссы... 🎙️" : "recording audio... 🎙️");
					} else {
						setUserStatus(t.online);
					}
				}
			} catch (err) {
				console.error("Parsing error:", err);
			}
		};

		return () => {
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(
					JSON.stringify({
						type: "TYPING_STATUS",
						chatId: activeChatId,
						senderId: activeUserId,
						status: "online",
					}),
				);
			}
			ws.close();
		};
	}, [chatId, currentUserId]);

	const handleTextChange = (text: string) => {
		setInputText(text);
		if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
			wsRef.current.send(
				JSON.stringify({
					type: "TYPING_STATUS",
					chatId: chatId || "demo_room",
					senderId: Platform.OS === "android" ? "id_aslan_test" : "id_alan_test",
					status: text.trim().length > 0 ? "typing" : "online",
				}),
			);
		}
	};

	const sendMessage = () => {
		if (!inputText.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

		const activeChatId = chatId || "demo_room";
		const activeUserId = Platform.OS === "android" ? "id_aslan_test" : "id_alan_test";
		const textToSend = inputText.trim();
		const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

		const myNewMessage: Message = {
			id: Date.now().toString(),
			text: textToSend,
			sender: "me",
			time: currentTime,
		};
		setMessages((prev) => [...prev, myNewMessage]);
		setInputText("");

		wsRef.current.send(
			JSON.stringify({
				type: "NEW_MESSAGE",
				chatId: activeChatId,
				senderId: activeUserId,
				text: textToSend,
			}),
		);

		setTimeout(() => {
			if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
				wsRef.current.send(
					JSON.stringify({
						type: "TYPING_STATUS",
						chatId: activeChatId,
						senderId: activeUserId,
						status: "online",
					}),
				);
			}
		}, 100);
	};

	return (
		<View style={styles.container}>
			<View style={styles.headerNeo}>
				<Pressable
					onPress={() => router.back()}
					style={({ pressed }) => [
						styles.backButtonNeo,
						pressed && styles.buttonPressedNeo,
						{ transform: [{ scale: pressed ? 0.92 : 1 }] },
					]}
				>
					<Text style={styles.backButtonText}>←</Text>
				</Pressable>

				<View style={styles.headerInfo}>
					<Text style={styles.headerName}>{name || "Алан"}</Text>
					<Text style={styles.headerStatus}>{userStatus}</Text>
				</View>

				<View style={styles.avatarOuter}>
					<Image source={{ uri: avatar || "https://unsplash.com" }} style={styles.avatarImg} />
				</View>
			</View>

			<ScrollView
				ref={scrollViewRef}
				contentContainerStyle={styles.messagesList}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
				onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
			>
				{messages.map((msg) => {
					const isMe = msg.sender === "me";
					return (
						<View
							key={msg.id}
							style={[
								styles.messageWrapper,
								isMe ? { justifyContent: "flex-end" } : { justifyContent: "flex-start" },
							]}
						>
							<View style={[isMe ? styles.messageCardMeNeo : styles.messageCardOtherNeo]}>
								<Text style={isMe ? styles.messageTextMe : styles.messageTextOther}>{msg.text}</Text>
								<Text style={styles.messageTime}>{msg.time}</Text>
							</View>
						</View>
					);
				})}
			</ScrollView>

			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"} style={{ width: "100%" }}>
				<View style={styles.inputContainer}>
					<View style={styles.inputWrapperNeo}>
						<TextInput
							style={styles.chatInput}
							placeholder={t.placeholderMessage}
							placeholderTextColor="#7C6652"
							value={inputText}
							onChangeText={handleTextChange}
							multiline
							cursorColor="#000000"
							selectionColor="#000000"
						/>
					</View>

					<Pressable
						onPress={sendMessage}
						style={({ pressed }) => [
							styles.sendButtonNeo,
							pressed && styles.buttonPressedNeo,
							{ transform: [{ scale: pressed ? 0.92 : 1 }] },
						]}
					>
						<Text style={styles.sendButtonText}>➔</Text>
					</Pressable>
				</View>
			</KeyboardAvoidingView>
		</View>
	);
}
