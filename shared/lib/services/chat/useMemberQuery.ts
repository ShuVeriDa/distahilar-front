import { ChatMemberType, MemberRole } from "@/prisma/models"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ChangeMemberRoleRequest, memberService } from "./member.service"

export const useFetchMembersQuery = (chatId?: string) => {
	return useQuery<ChatMemberType[]>({
		queryFn: async () => await memberService.getMembers(chatId!),
		queryKey: ["fetchMembers", chatId],
		enabled: !!chatId,
	})
}

export const useChangeMemberRoleMutation = (chatId: string) => {
	const client = useQueryClient()
	return useMutation({
		mutationFn: (params: { memberId: string; role: MemberRole }) =>
			memberService.changeRole(params.memberId, {
				chatId,
				role: params.role,
			} as ChangeMemberRoleRequest),
		mutationKey: ["changeMemberRole", chatId],
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["fetchChatById", chatId] })
			client.invalidateQueries({ queryKey: ["fetchMembers", chatId] })
		},
	})
}

export const useRemoveMemberMutation = (chatId: string) => {
	const client = useQueryClient()
	return useMutation({
		mutationFn: (memberId: string) =>
			memberService.removeMember(memberId, { chatId }),
		mutationKey: ["removeMember", chatId],
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["fetchChatById", chatId] })
			client.invalidateQueries({ queryKey: ["fetchMembers", chatId] })
			client.invalidateQueries({ queryKey: ["fetchChatsWS"] })
		},
	})
}
