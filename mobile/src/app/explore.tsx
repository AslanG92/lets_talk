import { Platform, Pressable, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function TabTwoScreen() {
	const safeAreaInsets = useSafeAreaInsets();
	const insets = {
		...safeAreaInsets,
		bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
	};
	const theme = useTheme();

	const contentPlatformStyle = Platform.select({
		android: {
			paddingTop: insets.top,
			paddingLeft: insets.left,
			paddingRight: insets.right,
			paddingBottom: insets.bottom,
		},
		web: {
			paddingTop: Spacing.six,
			paddingBottom: Spacing.four,
		},
	});

	return (
		<ScrollView
			style={[styles.scrollView, { backgroundColor: theme.background }]}
			contentInset={insets}
			contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
		>
			<ThemedView style={styles.container}>
				<ThemedView style={styles.titleContainer}>
					<ThemedText type="subtitle">Explore</ThemedText>
					<ThemedText style={styles.centerText} themeColor="textSecondary">
						This starter app includes example code to help you get started.
					</ThemedText>
				</ThemedView>
			</ThemedView>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	scrollView: { flex: 1 },
	contentContainer: { flexDirection: "row", justifyContent: "center" },
	container: { maxWidth: MaxContentWidth, flexGrow: 1 },
	titleContainer: { gap: Spacing.three, alignItems: "center", paddingVertical: Spacing.six },
	centerText: { textAlign: "center" },
});
