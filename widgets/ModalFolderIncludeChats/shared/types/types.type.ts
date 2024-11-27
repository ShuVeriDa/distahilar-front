import { FoundedChatsType } from "@/prisma/models"

export type ICutChat = Exclude<
	FoundedChatsType,
	"lastMessageDate" | "lastMessage"
>
