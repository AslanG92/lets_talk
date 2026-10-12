export const connectedUsers = new Map<string, string>();

export const socketHandler = {
	open: (ws: any) => {
		console.log(`🔌 Новое сырое сокет-подключение открыто (Socket ID: ${ws.id})`);
	},

	message: (ws: any, message: any) => {
		try {
			const payload = typeof message === "string" ? JSON.parse(message) : message;
			const { type, chatId, senderId, text, status } = payload;

			if (type === "JOIN_CHAT") {
				if (senderId) {
					connectedUsers.set(senderId, ws.id);
					ws.data.currentUserId = senderId;
					console.log(`📱 Пользователь ${senderId} успешно авторизован в сокете.`);
				}
				if (chatId) {
					ws.subscribe(chatId);
					console.log(`📌 Сокет ${ws.id} успешно подписан на комнату чата: ${chatId}`);
				}
			}

			if (type === "NEW_MESSAGE" && chatId) {
				console.log(`💬 Пересылка сообщения в ${chatId} от ${senderId}: ${text}`);

				const messageData = {
					type: "RECEIVE_MESSAGE",
					chatId,
					senderId,
					text,
					time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
				};

				ws.publish(chatId, messageData);
				ws.send(JSON.stringify(messageData));
			}

			if (type === "TYPING_STATUS" && chatId) {
				ws.publish(chatId, {
					type: "USER_STATUS_UPDATE",
					senderId,
					status,
				});
			}
		} catch (error) {
			console.error("❌ Ошибка обработки WebSocket сообщения:", error);
		}
	},

	close: (ws: any) => {
		const userId = ws.data?.currentUserId;
		if (userId) {
			connectedUsers.delete(userId);
			console.log(`❌ Пользователь ${userId} отключился от WebSocket`);
		}
	},
};
