import { Elysia } from "elysia";
import { chatController } from "../controllers/chatController";

export const chatRoutes = (app: Elysia) =>
	app.group("/chats", (group) =>
		group
			.post("/create", chatController.createChat)
			.post("/send-message", async (context) => {
				const server = context.server;
				const notifyUsers = (chatId: string, messageData: any) => {
					if (server) {
						server.publish(`chat_${chatId}`, JSON.stringify({ event: "new_message", data: messageData }));
						console.log(`⚡ The message has been sent to the WebSocket room. chat_${chatId}`);
					}
				};

				return chatController.sendMessage({ body: context.body, notifyUsers });
			})
			.get("/messages", chatController.getMessages),
	);
