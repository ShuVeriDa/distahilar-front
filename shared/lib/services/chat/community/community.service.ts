import { ChatRole } from "@/prisma/models"
import { getCommunityUrl } from "@/shared/lib/axios/api.config"
import { instance } from "@/shared/lib/axios/axios"

export interface ICreateCommunity {
	name: string
	description: string
	type: ChatRole
	imageUrl?: string
}

export const communityService = {
	async createCommunity(data: ICreateCommunity) {
		const res = await instance.post<string>(getCommunityUrl(""), data)

		return res.data
	},
}
