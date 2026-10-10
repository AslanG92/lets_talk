const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const WS_URL = process.env.EXPO_PUBLIC_WS_URL;

export const API_ENDPOINTS = {
	REGISTER: `${BASE_URL}/auth/register`,
	LOGIN: `${BASE_URL}/auth/login`,
	CREATE_CHAT: `${BASE_URL}/chats/create`,
	SEND_MESSAGE: `${BASE_URL}/chats/send-message`,
	GET_MESSAGES: (chatId: string) => `${BASE_URL}/chats/messages?chatId=${chatId}`,
	WS: WS_URL,
};
