import { useState, useRef } from "react";
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { TRANSLATIONS } from "../constants/languages";
import { styles } from "@/components/chat-room.styles";

// Тестовая переписка для визуализации
const INITIAL_MESSAGES = [
	{ id: "1", text: "Салам Алейкум, брат! Куыд у хабӕрттӕ?", sender: "other", time: "14:30" },
	{ id: "2", text: "Уалейкум Салам! Пысылмон дин рӕзы, куыст цӕуы, мессенджер фысӕм! 🔥", sender: "me", time: "14:31" },
	{ id: "3", name: "Раджы нӕ фӕндаг фӕци... Кӕд фембӕлдзыстӕм?", sender: "other", time: "14:32" },
];

export default function ChatRoomScreen() {
	const router = useRouter();
	const [lang, setLang] = useState<"en" | "os">("os");
	const t = TRANSLATIONS[lang];
	const { name, avatar } = useLocalSearchParams<{ name: string; avatar: string }>(); // Получаем данные собеседника
	const [messages, setMessages] = useState(INITIAL_MESSAGES);
	const [inputText, setInputText] = useState("");
	const scrollViewRef = useRef<ScrollView>(null);

	const sendMessage = () => {
		if (!inputText.trim()) return;

		const newMessage = {
			id: Date.now().toString(),
			text: inputText.trim(),
			sender: "me",
			time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
		};

		setMessages([...messages, newMessage]);
		setInputText("");

		// Плавный скролл вниз при отправке
		setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
	};

	return (
		<View style={styles.container}>
			{/* 👑 ВЕРХНЯЯ НЕОМОРФНАЯ ПАНЕЛЬ (HEADER) */}
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
					<Text style={styles.headerStatus}>{t.online}</Text>
				</View>

				<View style={styles.avatarOuter}>
					<Image source={{ uri: avatar || "https://unsplash.com" }} style={styles.avatarImg} />
				</View>
			</View>

			{/* 📱 ЛЕНТА СООБЩЕНИЙ */}
			<ScrollView
				ref={scrollViewRef}
				contentContainerStyle={styles.messagesList}
				showsVerticalScrollIndicator={false}
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

			{/* ⌨️ НИЖНЯЯ ПАНЕЛЬ ВВОДА С КНОПКОЙ */}
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "padding"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 20}
			>
				<View style={styles.inputContainer}>
					<View style={styles.inputWrapperNeo}>
						<TextInput
							style={styles.chatInput}
							placeholder={t.placeholderMessage}
							placeholderTextColor="#7C6652"
							value={inputText}
							onChangeText={setInputText}
							multiline
							cursorColor="#000000"
							selectionColor="#000000"
						/>
					</View>

					<Pressable
						onPress={sendMessage}
						style={({ pressed }) => [
							styles.backButtonNeo,
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
