import {
	ChatMemberType,
	ChatRole,
	ChatType,
	MemberRole,
	UserType,
} from "@/prisma/models"
import { useTranslations } from "next-intl"
import { useFormatLastSeen } from "../lib/utils/formatLastSeen"
import { getName } from "../lib/utils/getName"

export const useChatInfo = (
	chat: ChatType | undefined,
	user: UserType | null
) => {
	const t = useTranslations("COMMON")
	const interlocutor = chat?.members.find(
		(m: ChatMemberType) => m.userId !== user?.id
	)?.user

	const isDialog = chat?.type === ChatRole.DIALOG
	const isGroup = chat?.type === ChatRole.GROUP
	const isGuest =
		chat?.members.find(m => m.userId === user?.id)?.role === MemberRole.GUEST
	const isOwner =
		chat?.members.find(m => m.userId === user?.id)?.role === MemberRole.OWNER
	const isAdmin =
		chat?.members.find(m => m.userId === user?.id)?.role === MemberRole.ADMIN
	const isModerator =
		chat?.members.find(m => m.userId === user?.id)?.role ===
		MemberRole.MODERATOR

	const nameOfChat = isDialog
		? getName(interlocutor?.name, interlocutor?.surname)
		: chat?.name

	const lastSeen = useFormatLastSeen(interlocutor?.lastSeen)
	const isOnline = interlocutor?.isOnline

	const online = interlocutor?.isOnline
		? t("ONLINE")
		: `${interlocutor?.lastSeen ? lastSeen : " "}`

	const onlineOrFollowers = isDialog
		? online
		: isGroup
		? `${chat?.members.length} ${t("MEMBERS")}`
		: `${chat?.members.length} ${t("SUBSCRIBERS")}`

	return {
		isOnline,
		nameOfChat,
		onlineOrFollowers,
		interlocutor,
		isGuest,
		isOwner,
		isAdmin,
		isModerator,
	}
}
