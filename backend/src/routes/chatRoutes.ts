import { Elysia } from "elysia";
import { chatController } from "../controllers/chatController";
import { supabase } from "../config/database";

export const chatRoutes = (app: Elysia) =>
	app.group("/chats", (group) =>
		group
			.get("/users", async () => {
				try {
					const { data, error } = await supabase.from("users").select("id, username, email, avatar_url");

					if (error) {
						return { success: false, error: error.message };
					}

					return { success: true, users: data };
				} catch (e: any) {
					return { success: false, error: e.message || "Server error when fetching users" };
				}
			})

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
