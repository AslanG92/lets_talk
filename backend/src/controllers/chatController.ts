import { supabase } from "../config/database";

export const chatController = {
	createChat: async ({ body }: { body: any }) => {
		const { name, isGroup, userIds } = body;

		if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
			return { success: false, error: "You must specify a list of participants (userIds)" };
		}

		try {
			const { data: chatData, error: chatError } = await supabase
				.from("chats")
				.insert([{ name: name || null, is_group: !!isGroup }])
				.select()
				.single();

			if (chatError) return { success: false, error: chatError.message };

			const participantsData = userIds.map((userId: string) => ({
				chat_id: chatData.id,
				user_id: userId,
			}));

			const { error: partError } = await supabase.from("chat_participants").insert(participantsData);

			if (partError) return { success: false, error: partError.message };

			return { success: true, message: "Chat successfully created!", chat: chatData };
		} catch (error: any) {
			return { success: false, error: error.message || "Server error while creating chat" };
		}
	},

	sendMessage: async ({ body, notifyUsers }: { body: any; notifyUsers: (chatId: string, messageData: any) => void }) => {
		const { chatId, senderId, type, content, fileUrl } = body;

		if (!chatId || !senderId) {
			return { success: false, error: "chatId and senderId are required" };
		}

		if (type !== "text" && type !== "voice") {
			return { success: false, error: "Message type must be strictly 'text' or 'voice'" };
		}

		try {
			const { data: messageData, error: msgError } = await supabase
				.from("messages")
				.insert([
					{
						chat_id: chatId,
						sender_id: senderId,
						type,
						content: type === "text" ? content : null,
						file_url: type === "voice" ? fileUrl : null,
					},
				])
				.select()
				.single();

			if (msgError) return { success: false, error: msgError.message };

			notifyUsers(chatId, messageData);

			return { success: true, message: "Message sent", data: messageData };
		} catch (error: any) {
			return { success: false, error: error.message || "Server error while sending" };
		}
	},

	getMessages: async ({ query }: { query: any }) => {
		const { chatId } = query;

		if (!chatId) {
			return { success: false, error: "The chatId parameter is required." };
		}

		try {
			const { data, error } = await supabase
				.from("messages")
				.select("*")
				.eq("chat_id", chatId)
				.order("created_at", { ascending: true });

			if (error) return { success: false, error: error.message };

			return { success: true, messages: data };
		} catch (error: any) {
			return { success: false, error: error.message || "Server error loading messages" };
		}
	},
};
