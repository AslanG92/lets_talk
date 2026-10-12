import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, ScrollView, TextInput, Image, ActivityIndicator, Pressable } from "react-native";
import { useFonts, PlaypenSans_400Regular, PlaypenSans_700Bold } from "@expo-google-fonts/playpen-sans";
import { styles } from "../components/chats.styles";

const DUMMY_CHATS = [
	{ id: "1", name: "Алан", lastMessage: "Раджы нӕ фӕндаг фӕци...", time: "14:32", unread: 2, avatar: "https://unsplash.com" },
	{
		id: "2",
		name: "Zarina",
		lastMessage: "See you tomorrow at the club! ☕",
		time: "12:15",
		unread: 0,
		avatar: "https://unsplash.com",
	},
	{
		id: "3",
		name: "Марат",
		lastMessage: "Ӕгас цу, куыд у дӕ хабӕрттӕ?",
		time: "Знон",
		unread: 1,
		avatar: "https://unsplash.com",
	},
];

export default function ChatsScreen() {
	const router = useRouter();
	const [search, setSearch] = useState("");
	const [fontsLoaded] = useFonts({
		"Playpen-Regular": PlaypenSans_400Regular,
		"Playpen-Bold": PlaypenSans_700Bold,
	});

	if (!fontsLoaded) {
		return (
			<View style={{ flex: 1, backgroundColor: "#E5CCA0", justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color="#3E2F1C" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={{ position: "relative" }}>
					<Text
						style={[
							styles.headerTitle,
							{
								position: "absolute",
								top: -1.5,
								left: -1.5,
								color: "#ffffff",
								textShadowColor: "transparent",
							},
						]}
					>
						Ныхас 💬
					</Text>

					<Text style={styles.headerTitle}>Ныхас 💬</Text>
				</View>

				<View style={styles.avatarNeoOuter}>
					<Image source={{ uri: "https://unsplash.com" }} style={styles.avatarImage} />
				</View>
			</View>

			<View style={styles.searchContainer}>
				<TextInput
					style={styles.searchNeoInput}
					placeholder="Сгӕрсын / Search..."
					placeholderTextColor="#7C6652"
					value={search}
					onChangeText={setSearch}
				/>
			</View>

			<ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
				{DUMMY_CHATS.map((chat) => (
					<Pressable
						key={chat.id}
						style={({ pressed }) => [
							styles.chatCardNeo,
							pressed && styles.chatCardNeoPressed,
							{ transform: [{ scale: pressed ? 0.98 : 1 }] },
						]}
						onPress={() =>
							router.push({
								pathname: "/chat-room",
								params: { name: chat.name, avatar: chat.avatar },
							})
						}
					>
						<View style={styles.chatRow}>
							<Image source={{ uri: chat.avatar }} style={styles.chatAvatar} />

							<View style={styles.chatContent}>
								<View style={styles.chatHeaderRow}>
									<Text style={styles.chatName}>{chat.name}</Text>
									<Text style={styles.chatTime}>{chat.time}</Text>
								</View>
								<Text style={styles.chatMessage} numberOfLines={1}>
									{chat.lastMessage}
								</Text>
							</View>

							{chat.unread > 0 && (
								<View style={styles.unreadBadgeNeo}>
									<Text style={styles.unreadText}>{chat.unread}</Text>
								</View>
							)}
						</View>
					</Pressable>
				))}
			</ScrollView>
		</View>
	);
}
