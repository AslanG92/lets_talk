import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
	backgroundImage: {
		flex: 1,
	},
	overlay: {
		flex: 1,
		backgroundColor: "rgba(15, 23, 42, 0.2)",
		paddingHorizontal: 24,
		justifyContent: "space-between",
		paddingTop: Platform.OS === "ios" ? 60 : 50,
		paddingBottom: Platform.OS === "ios" ? 40 : 35,
	},
	topLangContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		width: "100%",
		zIndex: 10,
	},
	langText: {
		fontFamily: "Playpen-Bold",
		color: "rgba(255, 255, 255, 0.4)",
		fontSize: 16,
	},
	langActive: {
		color: "#F5F5DC",
		textShadowColor: "rgba(255, 255, 255, 0.6)",
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 8,
	},
	topHeaderContainer: {
		alignItems: "center",
		marginBottom: 100,
		width: "100%",
	},
	mainTitle: {
		fontFamily: "Playpen-Bold",
		fontSize: 32,
		color: "#F5F5DC",
		textAlign: "center",
		textShadowColor: "-1px -1px 1px rgba(0, 0, 0, 0.9), 1px 1px 1px rgba(0, 0, 0, 0.9), 1px 1px 1px rgba(0, 0, 0, 0.9)",
		textShadowOffset: { width: 1, height: 2 },
		textShadowRadius: 5,
	},
	centerFieldsContainer: {
		width: "100%",
	},
	neumorphicCard: {
		backgroundColor: "rgba(255, 255, 255, 0.12)",
		borderRadius: 24,
		padding: 20,
		boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.6), -3px -3px 6px rgba(255, 255, 255, 0.4)",
	},
	inputWrapper: {
		marginBottom: 14,
	},
	fieldLabel: {
		fontFamily: "Playpen-Regular",
		fontSize: 14,
		color: "#F5F5DC",
		marginBottom: 6,
	},
	transparentInput: {
		fontFamily: "Playpen-Regular",
		backgroundColor: "rgba(255, 255, 255, 0.15)",
		borderRadius: 14,
		paddingHorizontal: 16,
		paddingVertical: 12,
		color: "#F5F5DC",
		fontSize: 15,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.1)",
	},

	bottomButtonsContainer: {
		width: "100%",
		gap: 20,
	},
	pureExtrudedButton: {
		width: "100%",
		paddingVertical: 16,
		borderRadius: 16,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(255, 255, 255, 0.01)",
		shadowColor: "#000000",
		shadowOffset: { width: 3, height: 3 },
		shadowOpacity: 0.5,
		shadowRadius: 6,
		boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.6), -3px -3px 6px rgba(255, 255, 255, 0.4)",
	},

	pureExtrudedButtonPressed: {
		shadowColor: "#ffffff",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.3,
		shadowRadius: 5,
		boxShadow: "0px 0px 5px rgba(255, 255, 255, 0.6)",
		backgroundColor: "rgba(255, 255, 255, 0.01)",
	},
	pureButtonText: {
		fontFamily: "Playpen-Bold",
		fontSize: 17,
		fontWeight: "600",
	},
	switchText: {
		fontFamily: "Playpen-Regular",
		fontSize: 14,
		color: "#e2e8f",
		textDecorationLine: "underline",
	},
});
