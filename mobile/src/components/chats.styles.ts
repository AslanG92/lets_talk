import { StyleSheet, Platform } from "react-native";
const BG_COLOR = "#E5CCA0";

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: BG_COLOR,
		paddingHorizontal: 20,
		paddingTop: Platform.OS === "ios" ? 60 : 50,
	},

	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 24,
		width: "100%",
	},

	headerTitle: {
		fontFamily: "Playpen-Bold",
		fontSize: 34,
		color: BG_COLOR,
		textShadowColor: "rgba(130, 110, 85, 0.65)",
		textShadowOffset: { width: 2.5, height: 2.5 },
		textShadowRadius: 3,
		paddingRight: Platform.OS === "ios" ? 12 : 0,
	},

	avatarNeoOuter: {
		width: 54,
		height: 54,
		borderRadius: 27,
		backgroundColor: BG_COLOR,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.01)",
		shadowColor: "#000000",
		shadowOffset: { width: 3, height: 3 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		boxShadow: "2px 2px 4px rgba(130, 110, 85, 0.9), -2px -2px 4px rgba(255, 255, 255, 0.95)",
		padding: 2,
	},
	avatarImage: {
		width: "100%",
		height: "100%",
		borderRadius: 27,
	},

	searchContainer: {
		marginBottom: 20,
		width: "100%",
	},
	searchNeoInput: {
		fontFamily: "Playpen-Regular",
		width: "100%",
		backgroundColor: BG_COLOR,
		borderRadius: 16,
		paddingHorizontal: 16,
		paddingVertical: 12,
		fontSize: 15,
		color: "#3E2F1C",
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.01)",
		boxShadow: "inset 2px 2px 2px rgba(130, 110, 85, 0.45), inset -2px -2px 2px rgba(255, 255, 255, 0.85)",
	},

	scrollList: {
		paddingVertical: 10,
		paddingHorizontal: 16,
		gap: 20,
	},
	chatCardNeo: {
		width: "100%",
		backgroundColor: BG_COLOR,
		borderRadius: 22,
		padding: 18,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.01)",
		shadowColor: "#000000",
		shadowOffset: { width: 4, height: 4 },
		shadowOpacity: 0.08,
		shadowRadius: 5,
		elevation: 4,
		boxShadow: "3px 3px 6px rgba(130, 110, 85, 0.9), -3px -3px 6px rgba(255, 255, 255, 0.9)",
	},
	chatRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	chatAvatar: {
		width: 52,
		height: 52,
		borderRadius: 16,
		marginRight: 14,
	},
	chatContent: {
		flex: 1,
		justifyContent: "center",
	},
	chatHeaderRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 4,
	},
	chatName: {
		fontFamily: "Playpen-Bold",
		fontSize: 16,
		color: "#3E2F1C",
	},
	chatTime: {
		fontFamily: "Playpen-Regular",
		fontSize: 12,
		color: "#7C6652",
	},
	chatMessage: {
		fontFamily: "Playpen-Regular",
		fontSize: 14,
		color: "#5C4A36",
	},

	unreadBadgeNeo: {
		backgroundColor: BG_COLOR,
		minWidth: 24,
		height: 24,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 6,
		marginLeft: 8,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.01)",
		boxShadow: "2px 2px 4px rgba(130, 110, 85, 0.45), -2px -2px 4px rgba(255, 255, 255, 0.85)",
	},
	unreadText: {
		fontFamily: "Playpen-Bold",
		fontSize: 11,
		color: "#1E3A8A",
	},

	chatCardNeoPressed: {
		shadowColor: "transparent",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.3,
		shadowRadius: 5,
		boxShadow: "0px 0px 5px rgba(255, 255, 255, 0.6)",
		backgroundColor: "rgba(255, 255, 255, 0.01)",
	},
});
