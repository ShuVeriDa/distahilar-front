import {
	ChatMemberType,
	ChatRole,
	ChatType,
	MessageType,
} from "@/prisma/models"
import { useMemo } from "react"

interface UseChatRoomComputedProps {
	chat: ChatType | undefined
	user: { id: string } | null | undefined
	flatMessages: MessageType[]
	isRoomLive: boolean
	onlineOrFollowers: string
}

export const useChatRoomComputed = ({
	chat,
	user,
	flatMessages,
	isRoomLive,
	onlineOrFollowers,
}: UseChatRoomComputedProps) => {
	const peerUserId = useMemo(() => {
		return (
			chat?.members?.find((m: ChatMemberType) => m.userId !== user?.id)
				?.userId || null
		)
	}, [chat?.members, user?.id])

	const isMember = useMemo(() => {
		return (
			chat?.members?.some((m: ChatMemberType) => m.userId === user?.id) || false
		)
	}, [chat?.members, user?.id])

	const typeOfChat = chat?.type

	const pinnedMessages = useMemo(() => {
		return flatMessages.find(msg => msg.isPinned)
	}, [flatMessages])

	const headerSubtitle = useMemo(() => {
		return (chat?.type === ChatRole.GROUP || chat?.type === ChatRole.CHANNEL) &&
			isRoomLive
			? `${onlineOrFollowers} • LIVE`
			: onlineOrFollowers
	}, [chat?.type, isRoomLive, onlineOrFollowers])

	return {
		peerUserId,
		isMember,
		typeOfChat,
		pinnedMessages,
		headerSubtitle,
	}
}
