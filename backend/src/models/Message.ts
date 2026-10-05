export interface Message {
	id: string;
	chat_id: string;
	sender_id: string;

	type: "text" | "voice";

	content: string | null;
	file_url: string | null;

	created_at: string;
}
