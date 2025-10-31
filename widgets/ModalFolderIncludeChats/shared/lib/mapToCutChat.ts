import { ChatRole, ChatType } from "@/prisma/models"

export const mapToCutChat = (chat: ChatType) => {
	const chatId = chat.id

	return {
		chatId,
		name: chat.name,
		imageUrl: chat.imageUrl || "",
		lastMessage: null,
		lastMessageDate: null,
		lengthUnread: null,
		type: chat.type as ChatRole,
		members: chat.members as ChatType["members"],
	}
}
