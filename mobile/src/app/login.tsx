import { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, ImageBackground, Alert, TouchableOpacity } from "react-native";
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
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
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
		if (email.trim() === "" && password.trim() === "") return;
		if (!email || !password || (!isLogin && !username)) {
			Alert.alert(t.error, t.errorFields);
			return;
		}

		setLoading(true);
		try {
			const response = await fetch(isLogin ? API_ENDPOINTS.LOGIN : API_ENDPOINTS.REGISTER, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(isLogin ? { email, password } : { email, password, username }),
			});
			const result = await response.json();
			if (result.success) {
				Alert.alert(t.success, lang === "os" ? "Ӕнтыстджынӕй регистраци рацыдтӕ!" : "Success!");
				if (!isLogin) {
					setIsLogin(true);
					setStep("form");
				}
			} else {
				Alert.alert(t.error, result.error || "Error");
			}
		} catch (error) {
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
			<View style={styles.overlay}>
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

				<View style={styles.centerFieldsContainer}>
					{step === "form" && (
						<View style={styles.neumorphicCard}>
							{!isLogin && (
								<View style={styles.inputWrapper}>
									<Text style={styles.fieldLabel}>{t.username}</Text>
									<TextInput
										style={styles.transparentInput}
										placeholder="Username"
										placeholderTextColor="rgba(255, 255, 255, 0.4)"
										value={username}
										onChangeText={setUsername}
										autoCapitalize="none"
									/>
								</View>
							)}

							<View style={styles.inputWrapper}>
								<Text style={styles.fieldLabel}>{t.email}</Text>
								<TextInput
									style={styles.transparentInput}
									placeholder="Email"
									placeholderTextColor="rgba(255, 255, 255, 0.4)"
									value={email}
									onChangeText={setEmail}
									keyboardType="email-address"
									autoCapitalize="none"
								/>
							</View>

							<View style={styles.inputWrapper}>
								<Text style={styles.fieldLabel}>{t.password}</Text>
								<TextInput
									style={styles.transparentInput}
									placeholder="Password"
									placeholderTextColor="rgba(255, 255, 255, 0.4)"
									value={password}
									onChangeText={setPassword}
									secureTextEntry
									autoCapitalize="none"
								/>
							</View>
						</View>
					)}
				</View>

				<View style={styles.bottomButtonsContainer}>
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
									<Text style={[styles.pureButtonText, { color: pressed ? "#F5F5DC" : "#F5F5DC" }]}>
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
									<Text style={[styles.pureButtonText, { color: pressed ? "#F5F5DC" : "#F5F5DC" }]}>
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
										<Text style={[styles.pureButtonText, { color: pressed ? "#F5F5DC" : "#F5F5DC" }]}>
											{isLogin ? t.login : t.register}
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
			</View>

			<VideoView style={{ width: 0, height: 0 }} player={player} nativeControls={false} />
		</ImageBackground>
	);
}
