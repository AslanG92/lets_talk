import { useEffect } from "react";
import { useColorScheme, LogBox } from "react-native";
import { Stack } from "expo-router";
import { ThemeProvider, DarkTheme, DefaultTheme } from "expo-router/react-navigation";
import * as SplashScreen from "expo-splash-screen";

LogBox.ignoreLogs(["Can't perform a React state update on a component that hasn't mounted yet"]);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();

	useEffect(() => {
		const hideSplash = async () => {
			await SplashScreen.hideAsync();
		};
		hideSplash();
	}, []);

	return (
		<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="index" />
				<Stack.Screen name="login" />
			</Stack>
		</ThemeProvider>
	);
}
