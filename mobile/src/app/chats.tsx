import { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, Pressable, Image, ActivityIndicator, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFonts, PlaypenSans_400Regular, PlaypenSans_700Bold } from "@expo-google-fonts/playpen-sans";
import { API_ENDPOINTS } from "../constants/api";
import { TRANSLATIONS } from "../constants/languages";
import { styles } from "../components/chats.styles";

interface UserProfile {
	id: string;
	username: string;
	avatar_url: string | null;
	email: string;
	isOnline?: boolean;
}

export default function ChatsScreen() {
	const [myUserId, setMyUserId] = useState<string>("");
	const [myUsername, setMyUsername] = useState<string>("");

	const router = useRouter();
	const { currentUsername, currentUserId } = useLocalSearchParams<{ currentUsername: string; currentUserId: string }>();
	const [search, setSearch] = useState("");
	const [users, setUsers] = useState<UserProfile[]>([]);
	const [loadingUsers, setLoadingUsers] = useState(true);
	const [lang] = useState<"en" | "os">("os");
	const t = TRANSLATIONS[lang];

	const [fontsLoaded] = useFonts({
		"Playpen-Regular": PlaypenSans_400Regular,
		"Playpen-Bold": PlaypenSans_700Bold,
	});

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const baseUrl = API_ENDPOINTS.REGISTER.replace("/auth/register", "");
				const res = await fetch(`${baseUrl}/chats/users`);
				const result = await res.json();

				if (result.success) {
					setUsers(result.users);
				}
			} catch (err) {
				console.log("Network error while retrieving users:", err);
			} finally {
				setLoadingUsers(false);
			}
		};

		fetchUsers();
	}, []);

	if (!fontsLoaded || loadingUsers) {
		return (
			<View style={{ flex: 1, backgroundColor: "#E5CCA0", justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color="#3E2F1C" />
			</View>
		);
	}

	const filteredUsers = users.filter((user) => {
		const isNotMe = user.username.toLowerCase() !== (currentUsername || "").toLowerCase();
		const matchesSearch = user.username.toLowerCase().includes(search.toLowerCase());
		return isNotMe && matchesSearch;
	});

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={{ position: "relative" }}>
					<Text
						style={[
							styles.headerTitle,
							{ position: "absolute", top: -1.5, left: -1.5, color: "#ffffff", textShadowColor: "transparent" },
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
					placeholder={lang === "os" ? "Сгӕрсын..." : "Search..."}
					placeholderTextColor="#7C6652"
					value={search}
					onChangeText={setSearch}
				/>
			</View>

			<ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
				{filteredUsers.length === 0 ? (
					<Text style={{ fontFamily: "Playpen-Regular", color: "#7C6652", textAlign: "center", marginTop: 40 }}>
						{lang === "os" ? "Архайджытæ нæ разындысты" : "No users found"}
					</Text>
				) : (
					filteredUsers.map((user) => (
						<Pressable
							key={user.id}
							style={({ pressed }) => [
								styles.chatCardNeo,
								pressed && styles.chatCardNeoPressed,
								{ transform: [{ scale: pressed ? 0.98 : 1 }] },
							]}
							onPress={() => {
								const isAndroid = Platform.OS === "android";
								const myId = isAndroid ? "id_aslan_test" : "id_alan_test";
								const combinedChatId = "room_aslan_and_alan_nexus";

								router.push({
									pathname: "/chat-room",
									params: {
										name: user.username,
										avatar: user.avatar_url || "https://unsplash.com",
										chatId: combinedChatId,
										currentUserId: myId,
									},
								});
							}}
						>
							<View style={styles.chatRow}>
								<Image source={{ uri: user.avatar_url || "https://unsplash.com" }} style={styles.chatAvatar} />

								<View style={styles.chatContent}>
									<View style={styles.chatHeaderRow}>
										<Text style={styles.chatName}>{user.username}</Text>
									</View>

									<Text style={styles.chatMessage} numberOfLines={1}>
										{lang === "os" ? "Бацӕуын ныхасмӕ..." : "Tap to open chat..."}
									</Text>
								</View>
							</View>
						</Pressable>
					))
				)}
			</ScrollView>
		</View>
	);
}
