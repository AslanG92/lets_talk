import { Elysia } from "elysia";
import "./src/config/database";
import { authRoutes } from "./src/routes/authRoutes";
import { chatRoutes } from "./src/routes/chatRoutes";
import { socketHandler } from "./src/utils/socket";

const PORT = Number(Bun.env.PORT) || 5050;

const app = new Elysia()
	.get("/ping", () => "Pong!")

	.ws("/ws", {
		open(ws) {
			socketHandler.open(ws);

			const chatId = ws.data.query?.chatId;
			if (chatId) {
				ws.subscribe(`chat_${chatId}`);
				console.log(`📌 The socket is subscribed to a room: chat_${chatId}`);
			}
		},
		message(ws, message) {
			socketHandler.message(ws, message);
		},
		close(ws) {
			socketHandler.close(ws);
		},
	})

	.use(authRoutes)
	.use(chatRoutes)

	.listen(PORT);

console.log(`🚀 THE BACKEND IS FULLY READY AND LAUNCHED!`);
console.log(`🌐 HTTP API: http://localhost:${PORT}`);
console.log(`⚡ WebSocket API: ws://localhost:${PORT}/ws`);
