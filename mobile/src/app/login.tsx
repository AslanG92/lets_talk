import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	Pressable,
	ActivityIndicator,
	ImageBackground,
	Alert,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useFonts, PlaypenSans_400Regular, PlaypenSans_700Bold } from "@expo-google-fonts/playpen-sans";
import { API_ENDPOINTS } from "../constants/api";
import { TRANSLATIONS } from "../constants/languages";
import { styles } from "../components/login.styles";

const CLICKED_COLOR = "#F5F5DC";

export default function AuthScreen() {
	const router = useRouter();
	const [lang, setLang] = useState<"en" | "os">("os");
	const [step, setStep] = useState<"intro" | "form">("intro");
	const [isLogin, setIsLogin] = useState(true);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const [fontsLoaded] = useFonts({
		"Playpen-Regular": PlaypenSans_400Regular,
		"Playpen-Bold": PlaypenSans_700Bold,
	});

	const t = TRANSLATIONS[lang];

	const player = useVideoPlayer(require("@/assets/audio/osetian-song.mp3"), (playerInstance) => {
		playerInstance.loop = true;
		playerInstance.volume = 0.4;
		playerInstance.play();
	});

	if (!fontsLoaded) {
		return (
			<View style={{ flex: 1, backgroundColor: "#0f172a", justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color="#ffffff" />
			</View>
		);
	}

	const handleAction = async () => {
		if (!username.trim() || !password.trim()) {
			Alert.alert(t.error, t.errorFields);
			return;
		}

		setLoading(true);
		try {
			const endpoint = isLogin ? API_ENDPOINTS.LOGIN : API_ENDPOINTS.REGISTER;

			const res = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username: username.trim(),
					password: password,
					lang: lang,
				}),
			});
			const result = await res.json();

			if (result.success) {
				if (isLogin) {
					router.replace("/chats");
				} else {
					Alert.alert(t.success, lang === "os" ? "Ӕнтыстджынӕй регистраци рацыдтӕ!" : "Success!");
					setIsLogin(true);
					setStep("form");
				}
			} else {
				Alert.alert(t.error, result.error || "Error");
			}
		} catch (e) {
			Alert.alert(t.error, t.errorNetwork);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ImageBackground
			source={require("@/assets/images/auth-bg.jpg")}
			style={styles.backgroundImage}
			resizeMode="stretch"
			blurRadius={step === "form" ? 3 : 0}
		>
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"} style={{ flex: 1 }}>
				<ScrollView
					contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 40 }}
					bounces={false}
					keyboardShouldPersistTaps="handled"
				>
					<View style={styles.topLangContainer}>
						<TouchableOpacity style={{ marginRight: 16 }} onPress={() => setLang("os")}>
							<Text style={[styles.langText, lang === "os" && styles.langActive]}>Ирон ☀️</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => setLang("en")}>
							<Text style={[styles.langText, lang === "en" && styles.langActive]}>EN 🇬🇧</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.topHeaderContainer}>
						<Text style={styles.mainTitle}>
							{step === "intro" ? t.welcomeBack : isLogin ? t.welcomeBack : t.createAccount}
						</Text>
					</View>

					<View style={[styles.centerFieldsContainer, { marginBottom: 30 }]}>
						{step === "form" && (
							<View style={styles.neumorphicCard}>
								<View style={styles.inputWrapper}>
									<Text style={styles.fieldLabel}>{t.username}</Text>
									<TextInput
										style={styles.transparentInput}
										placeholder={t.placeholderUsername}
										placeholderTextColor="rgba(255, 255, 255, 0.4)"
										value={username}
										onChangeText={setUsername}
										autoCapitalize="none"
										cursorColor="#000000"
										selectionColor="#000000"
									/>
								</View>

								<View style={styles.inputWrapper}>
									<Text style={styles.fieldLabel}>{t.password}</Text>
									<TextInput
										style={styles.transparentInput}
										placeholder={t.placeholderPassword}
										placeholderTextColor="rgba(255, 255, 255, 0.4)"
										value={password}
										onChangeText={setPassword}
										secureTextEntry
										autoCapitalize="none"
										cursorColor="#000000"
										selectionColor="#000000"
									/>
								</View>
							</View>
						)}
					</View>

					<View style={[styles.bottomButtonsContainer, step === "intro" && { marginTop: "auto" }]}>
						{step === "intro" ? (
							<>
								<Pressable
									style={({ pressed }) => [
										styles.pureExtrudedButton,
										pressed && styles.pureExtrudedButtonPressed,
										{ transform: [{ scale: pressed ? 0.94 : 1 }] },
									]}
									onPress={() => {
										setIsLogin(true);
										setStep("form");
									}}
								>
									{({ pressed }) => (
										<Text style={[styles.pureButtonText, { color: pressed ? CLICKED_COLOR : "#F5F5DC" }]}>
											{t.startLogin}
										</Text>
									)}
								</Pressable>

								<Pressable
									style={({ pressed }) => [
										styles.pureExtrudedButton,
										pressed && styles.pureExtrudedButtonPressed,
										{ transform: [{ scale: pressed ? 0.94 : 1 }] },
									]}
									onPress={() => {
										setIsLogin(false);
										setStep("form");
									}}
								>
									{({ pressed }) => (
										<Text style={[styles.pureButtonText, { color: pressed ? CLICKED_COLOR : "#F5F5DC" }]}>
											{t.startRegister}
										</Text>
									)}
								</Pressable>
							</>
						) : (
							<>
								<Pressable
									style={({ pressed }) => [
										styles.pureExtrudedButton,
										pressed && styles.pureExtrudedButtonPressed,
										{ transform: [{ scale: pressed ? 0.94 : 1 }] },
									]}
									onPress={handleAction}
									disabled={loading}
								>
									{({ pressed }) =>
										loading ? (
											<ActivityIndicator color={CLICKED_COLOR} />
										) : (
											<Text style={[styles.pureButtonText, { color: pressed ? CLICKED_COLOR : "#F5F5DC" }]}>
												{isLogin ? t.login : lang === "os" ? "Регистраци" : "Register"}
											</Text>
										)
									}
								</Pressable>

								<TouchableOpacity
									style={{ alignItems: "center", marginTop: 10 }}
									onPress={() => setIsLogin(!isLogin)}
								>
									<Text style={styles.switchText}>{isLogin ? t.noAccount : t.hasAccount}</Text>
								</TouchableOpacity>

								<TouchableOpacity style={{ alignItems: "center", marginTop: 5 }} onPress={() => setStep("intro")}>
									<Text style={[styles.switchText, { opacity: 0.6 }]}>{t.back}</Text>
								</TouchableOpacity>
							</>
						)}
					</View>
				</ScrollView>
			</KeyboardAvoidingView>

			<VideoView style={{ width: 0, height: 0 }} player={player} nativeControls={false} />
		</ImageBackground>
	);
}
