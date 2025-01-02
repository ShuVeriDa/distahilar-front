import { ChatType, FoundedChatsType } from "@/prisma/models"
import { getChatUrl } from "../../axios/api.config"
import { instance } from "../../axios/axios"

export const chatService = {
	async getChatById(chatId: string) {
		const { data } = await instance.get<ChatType>(getChatUrl(`/${chatId}`))

		return data
	},

	async searchChat(value?: string) {
		const params = value ? `?name=${value}` : ""
		const { data } = await instance.get<FoundedChatsType[]>(
			getChatUrl(`/search${params}`)
		)

		return data
	},
}
