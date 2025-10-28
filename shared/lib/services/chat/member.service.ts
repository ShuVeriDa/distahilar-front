import { ChatType, MemberRole } from "@/prisma/models"
import { getMemberUrl } from "../../axios/api.config"
import { instance } from "../../axios/axios"

export type ChangeMemberRoleRequest = {
	chatId: string
	role: MemberRole
}

export type FetchMemberRequest = {
	chatId: string
}

export const memberService = {
	async getMembers(chatId: string) {
		const { data } = await instance.get(getMemberUrl(`/${chatId}`))
		return data as ChatType["members"]
	},

	async changeRole(memberId: string, body: ChangeMemberRoleRequest) {
		const { data } = await instance.patch<ChatType>(
			getMemberUrl(`/${memberId}`),
			body
		)
		return data
	},

	async removeMember(memberId: string, body: FetchMemberRequest) {
		const { data } = await instance.delete<string>(
			getMemberUrl(`/${memberId}`),
			{ data: body }
		)
		return data
	},
}
