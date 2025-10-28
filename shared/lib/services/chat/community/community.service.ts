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
	async leaveCommunity(communityId: string) {
		const res = await instance.patch<string>(
			getCommunityUrl(`/leave/${communityId}`)
		)

		return res.data
	},
	async deleteCommunity(communityId: string) {
		const res = await instance.delete<string>(
			getCommunityUrl(`/${communityId}`)
		)

		return res.data
	},
}
