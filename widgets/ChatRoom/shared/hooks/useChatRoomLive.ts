import { ChatType, MemberRole } from "@/prisma/models"
import { useLiveStatus } from "@/shared/hooks/useLiveStatus"
import { useLiveGlobal } from "@/shared/providers/LiveProvider"
import { useMemo } from "react"

interface UseChatRoomLiveProps {
	chat: ChatType | undefined
	user: { id: string } | null | undefined
	resolvedChatId: string
	nameOfChat: string | undefined
	isOwner: boolean
	isAdmin: boolean
	isModerator: boolean
}

export const useChatRoomLive = ({
	chat,
	user,
	resolvedChatId,
	nameOfChat,
	isOwner,
	isAdmin,
	isModerator,
}: UseChatRoomLiveProps) => {
	const { isLive: isRoomLive } = useLiveStatus(resolvedChatId)
	const live = useLiveGlobal()
	const { state: liveState, participants } = live
	const { room, isSelfMuted } = liveState

	const isPrivilegedMember = useMemo(() => {
		if (!chat || !user?.id) return false
		const me = chat.members.find(m => m.userId === user.id)
		if (!me) return false
		return me.role !== MemberRole.GUEST
	}, [chat, user?.id])

	// Is current user a participant of the ongoing live stream in this chat
	const isParticipantLive = (() => {
		const uId = user?.id
		if (!uId || !room?.isLive) return false
		if (room.hostId === uId) return true
		if (room.speakers.includes(uId)) return true
		if (room.listeners.includes(uId)) return true
		return false
	})()

	const maximizeWindowsLive = () => live.maximize()

	const leaveLive = () => {
		live.leaveLive()
	}

	const joinLive = () => {
		live.joinLive(resolvedChatId, {
			nameOfChat,
			chat: chat as ChatType,
			isPrivilegedMember,
		})
	}

	const startLive = () => {
		if (isRoomLive && isParticipantLive) {
			maximizeWindowsLive()
			return
		}
		if (isRoomLive && !isParticipantLive) {
			joinLive()
			return
		}
		if (isOwner || isAdmin || isModerator) {
			live.startLive(resolvedChatId, {
				nameOfChat,
				chat: chat as ChatType,
				isPrivilegedMember,
			})
		}
	}

	const handleLeaveClick = () => {
		live.openOverlay(resolvedChatId, {
			nameOfChat,
			chat: chat as ChatType,
			isPrivilegedMember,
		})
		if (isPrivilegedMember) {
			// Global overlay manages confirmation dialog
			live.setConfirmLeaveOpen(true)
			return
		}
		leaveLive()
	}

	return {
		isRoomLive,
		isParticipantLive,
		participants,
		isSelfMuted,
		maximizeWindowsLive,
		joinLive,
		startLive,
		handleLeaveClick,
	}
}
