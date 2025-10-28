"use client"

import { useToast } from "@/hooks/use-toast"
import { ChatMemberType, ChatRole, ChatType, MemberRole } from "@/prisma/models"
import { Typography } from "@/shared"
import { useUser } from "@/shared/hooks/useUser"
import {
	useChangeMemberRoleMutation,
	useFetchMembersQuery,
	useRemoveMemberMutation,
} from "@/shared/lib/services/chat/useMemberQuery"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/ui/Dropdown-menu/dropdown-menu"
import { useTranslations } from "next-intl"
import { FC, useMemo } from "react"

interface IMembersListProps {
	chat: ChatType | undefined
}

export const MembersList: FC<IMembersListProps> = ({ chat }) => {
	const t = useTranslations("MEMBERS")
	const { toast } = useToast()
	const { user } = useUser()
	const chatId = chat?.id
	const isGroup = chat?.type === ChatRole.GROUP
	const isChannel = chat?.type === ChatRole.CHANNEL

	const { data: fetchedMembers } = useFetchMembersQuery(chatId)
	const members: ChatMemberType[] = fetchedMembers || chat?.members || []

	const myRole = useMemo(() => {
		if (!user?.id || !chat?.members) return undefined
		return chat.members.find(m => m.userId === user.id)?.role as
			| MemberRole
			| undefined
	}, [chat?.members, user?.id])

	const canPromote = myRole === MemberRole.OWNER || myRole === MemberRole.ADMIN
	const canRemove = myRole === MemberRole.OWNER

	const changeRoleMutation = useChangeMemberRoleMutation(chatId || "")
	const removeMemberMutation = useRemoveMemberMutation(chatId || "")

	const changeRole = async (memberId: string, role: MemberRole) => {
		try {
			await changeRoleMutation.mutateAsync({ memberId, role })
			toast({ description: "Role updated" })
		} catch (e: unknown) {
			const message =
				(e as { response?: { data?: { message?: string } } })?.response?.data
					?.message ||
				(e as Error)?.message ||
				"Error"
			toast({ description: message, variant: "destructive" })
		}
	}

	const removeMember = async (memberId: string) => {
		try {
			await removeMemberMutation.mutateAsync(memberId)
			toast({
				description: isGroup ? "Removed from group" : "Removed from channel",
			})
		} catch (e: unknown) {
			const message =
				(e as { response?: { data?: { message?: string } } })?.response?.data
					?.message ||
				(e as Error)?.message ||
				"Error"
			toast({ description: message, variant: "destructive" })
		}
	}

	if (!chatId || (!isGroup && !isChannel)) return null

	return (
		<div className="w-full flex flex-col gap-2 px-5">
			<Typography
				tag="p"
				className="text-[13px] text-[#707579] dark:text-[#708499]"
			>
				{isGroup ? t("TITLE") : t("SUBSCRIBERS_TITLE")}
			</Typography>
			<div className="flex flex-col">
				{members.map(member => {
					const isMe = member.userId === user?.id
					const role = member.role as MemberRole
					const canManageThisUser = !isMe && role !== MemberRole.OWNER

					const showPromoteAdmin =
						canPromote && role !== MemberRole.ADMIN && role !== MemberRole.OWNER
					const showDemoteAdmin =
						myRole === MemberRole.OWNER && role === MemberRole.ADMIN
					const showPromoteModerator = canPromote && role === MemberRole.GUEST
					const showDemoteModerator =
						canPromote && role === MemberRole.MODERATOR
					const showRemove = canRemove && canManageThisUser

					const memberName =
						`${member.user?.name ?? ""} ${member.user?.surname ?? ""}`.trim() ||
						member.user?.username

					return (
						<div
							key={member.id}
							className="flex items-center justify-between py-2"
						>
							<div className="flex items-center gap-2">
								<div className="h-8 w-8 rounded-full bg-[#E7E7E7] overflow-hidden" />
								<div className="flex flex-col">
									<Typography
										tag="p"
										className="text-[14px] text-[#444444] dark:text-white"
									>
										{memberName} {isMe ? `· ${t("YOU")}` : ""}
									</Typography>
									<Typography
										tag="p"
										className="text-[12px] text-[#707579] dark:text-[#708499]"
									>
										{role}
									</Typography>
								</div>
							</div>

							{canManageThisUser && (
								<DropdownMenu>
									<DropdownMenuTrigger className="text-[#999999] text-sm px-2 py-1 rounded hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[#232E3C]">
										•••
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										{showPromoteAdmin && (
											<DropdownMenuItem
												onClick={() => changeRole(member.id, MemberRole.ADMIN)}
											>
												{t("MAKE_ADMIN")}
											</DropdownMenuItem>
										)}
										{showDemoteAdmin && (
											<DropdownMenuItem
												onClick={() => changeRole(member.id, MemberRole.GUEST)}
											>
												{t("REMOVE_ADMIN")}
											</DropdownMenuItem>
										)}
										{showPromoteModerator && (
											<DropdownMenuItem
												onClick={() =>
													changeRole(member.id, MemberRole.MODERATOR)
												}
											>
												{t("MAKE_MODERATOR")}
											</DropdownMenuItem>
										)}
										{showDemoteModerator && (
											<DropdownMenuItem
												onClick={() => changeRole(member.id, MemberRole.GUEST)}
											>
												{t("REMOVE_MODERATOR")}
											</DropdownMenuItem>
										)}
										{showRemove && (
											<DropdownMenuItem
												className="text-[#EC3942]"
												onClick={() => removeMember(member.id)}
											>
												{isGroup
													? t("REMOVE_FROM_GROUP")
													: t("REMOVE_FROM_CHANNEL")}
											</DropdownMenuItem>
										)}
									</DropdownMenuContent>
								</DropdownMenu>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}
