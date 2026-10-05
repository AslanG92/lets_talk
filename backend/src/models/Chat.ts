export interface Chat {
	id: string;
	name: string | null;
	is_group: boolean;
	created_at: string;
}

export interface ChatParticipant {
	id: string;
	chat_id: string;
	user_id: string;
	created_at: string;
}
