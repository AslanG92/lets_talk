export const connectedUsers = new Map<string, string>();

export const socketHandler = {
	open: (ws: any) => {
		const userId = ws.data.query?.userId;
		if (userId) {
			connectedUsers.set(userId, ws.id);
			console.log(`📱 User ${userId} connected to WebSocket (Socket ID: ${ws.id})`);
		}
	},

	message: (ws: any, message: any) => {
		console.log(`📩 Received socket message from ${ws.id}:`, message);
	},

	close: (ws: any) => {
		const userId = ws.data.query?.userId;
		if (userId) {
			connectedUsers.delete(userId);
			console.log(`❌ User ${userId} disconnected from WebSocket`);
		}
	},
};
