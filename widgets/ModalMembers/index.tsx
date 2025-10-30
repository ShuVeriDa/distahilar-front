"use client"

import { useToast } from "@/hooks/use-toast"
import { ChatMemberType, ChatRole, MemberRole } from "@/prisma/models"
import { Button, Typography, useModal } from "@/shared"
import { useUser } from "@/shared/hooks/useUser"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { useFetchChatByIdQuery } from "@/shared/lib/services/chat/useChatQuery"
import {
	useChangeMemberRoleMutation,
	useFetchMembersQuery,
	useRemoveMemberMutation,
} from "@/shared/lib/services/chat/useMemberQuery"
import { cn } from "@/shared/lib/utils/cn"
import { useTranslations } from "next-intl"
import { FC } from "react"
import { Search } from "../Search"
import { useMemberPermissions } from "./shared/hooks/useMemberPermissions"
import { useMembersFiltering } from "./shared/hooks/useMembersFiltering"
import { MemberListItem } from "./ui/MemberListItem"

export const ModalMembers: FC = () => {
	const t = useTranslations("MEMBERS")
	const tCommon = useTranslations("COMMON")
	const { toast } = useToast()
	const { onClose, currentModal, popoverRef } = useModal()
	const chatId = currentModal.data?.members?.chatId
	const { user } = useUser()

	const { data: chat } = useFetchChatByIdQuery(chatId || "")
	const { data: members } = useFetchMembersQuery(chatId)

	const list = (members || chat?.members || []) as ChatMemberType[]
	const { query, setQuery, filteredMembers } = useMembersFiltering(list)
	const { canPromote, canRemove } = useMemberPermissions(
		chat?.members as ChatMemberType[] | undefined,
		user?.id
	)

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
			toast({ description: "Removed" })
		} catch (e: unknown) {
			const message =
				(e as { response?: { data?: { message?: string } } })?.response?.data
					?.message ||
				(e as Error)?.message ||
				"Error"
			toast({ description: message, variant: "destructive" })
		}
	}

	const isGroup = chat?.type === ChatRole.GROUP

	const CLASSNAME_UNDERLINE =
		"relative after:absolute after:w-full after:h-[1px] after:left-[0px] after:bottom-0 after:bg-[#E7E7E7] after:dark:bg-[#101921]"

	return (
		<ModalLayout
			onClose={onClose}
			className="p-0 w-[420px] flex flex-col !gap-2"
			isXClose
			popoverRef={popoverRef}
			// isClickOutside
		>
			<div className={cn("flex flex-col gap-4 px-4 pt-4", CLASSNAME_UNDERLINE)}>
				<Typography tag="h4" className="font-normal">
					{isGroup ? t("TITLE") : t("SUBSCRIBERS_TITLE")}
				</Typography>
				<Search
					variant="searchV1"
					value={query}
					onChange={e => setQuery(e.target.value)}
					placeholder={tCommon("SEARCH")}
					className="placeholder:text-[#6D7883]"
				/>
			</div>

			<div className="flex flex-col max-h-[60vh] overflow-y-auto pr-1 telegram-scrollbar">
				{filteredMembers.map(member => (
					<MemberListItem
						key={member.id}
						member={member}
						isGroup={isGroup}
						canPromote={canPromote}
						canRemove={canRemove}
						onChangeRole={changeRole}
						onRemove={removeMember}
					/>
				))}
			</div>
			<div
				className={cn(
					"flex items-center justify-end px-3 py-2 after:top-0",
					CLASSNAME_UNDERLINE
				)}
			>
				<Button variant="withoutBg" size="md" onClick={onClose}>
					{tCommon("CLOSE")}
				</Button>
			</div>
		</ModalLayout>
	)
}
