"use client"

import { useFetchChatByIdQuery } from "@/shared/lib/services/chat/useChatQuery"
import { useMessagesWSQuery } from "@/shared/lib/services/message/useMessagesQuery"
import { FC, useMemo, useState } from "react"

import { ChatRole, ChatType, MemberRole, MessageType } from "@/prisma/models"
import { useUser, useWebRTCCall } from "@/shared"
import { useLiveStatus } from "@/shared/hooks/useLiveStatus"
import { useSelectedMessages } from "@/shared/hooks/useSelectedMessages"
import { useLiveGlobal } from "@/shared/providers/LiveProvider"

import { useChatInfo } from "@/shared/hooks/useChatInfo"
import { CallPhaseEnum } from "@/shared/lib/services/call/call.types"
import { WrapperMessages } from "../entities"
import { Header } from "../entities/Header"
import { SideBar } from "../entities/Sidebar"
import { RichMessageInput } from "../features"
import { JoinChat } from "../features/JoinChat"
import { PinnedMessage } from "../shared/ui/PinnedMessage"
import { CallOverlay } from "./call-overlay"
import { LiveBannerJoin } from "./live-banner-join"
import { LiveBannerJoined } from "./live-banner-joined"
// LiveOverlay moved to global LiveProvider

interface IChatRoomProps {
	chatId: string
	locale: string
}

export const ChatRoom: FC<IChatRoomProps> = ({ chatId, locale }) => {
	const { user } = useUser()
	const { data: chat, isLoading: isChatLoading } = useFetchChatByIdQuery(chatId)
	const { isLive: isRoomLive } = useLiveStatus(chatId)
	const [openSideBar, setOpenSideBar] = useState(false)
	const [editedMessage, setEditedMessage] = useState<MessageType | null>(null)
	const [callVisible, setCallVisible] = useState(false)
	const [callState, callApi] = useWebRTCCall()
	const live = useLiveGlobal()
	const { state: liveState, participants } = live
	const { room, isSelfMuted } = liveState

	const { onlineOrFollowers, nameOfChat, isOwner, isAdmin, isModerator } =
		useChatInfo(chat, user)

	const peerUserId =
		chat?.members?.find(m => m.userId !== user?.id)?.userId || null

	const isMember = chat?.members?.some(m => m.userId === user?.id)
	const typeOfChat = chat?.type

	const onToggleSideBar = () => setOpenSideBar(!openSideBar)

	const handleEditMessage = (message: MessageType | null) =>
		setEditedMessage(message)

	const startDialogCall = () => setCallVisible(true)
	const endDialogCall = () => setCallVisible(false)
	const maximizeWindowsLive = () => live.maximize()

	const {
		hasSelectedMessages,
		selectedMessages,
		setSelectedMessages,
		clearSelectedMessages,
	} = useSelectedMessages()
	const {
		data: messages,
		isSuccess: isSuccessMessages,
		isLoading: isLoadingMessages,
		// isLoading,
	} = useMessagesWSQuery(chatId)

	const pinnedMessages = messages?.messages.find(msg => msg.isPinned)

	const headerSubtitle =
		(chat?.type === ChatRole.GROUP || chat?.type === ChatRole.CHANNEL) &&
		isRoomLive
			? `${onlineOrFollowers} • LIVE`
			: onlineOrFollowers

	// Is current user a participant of the ongoing live stream in this chat
	const isParticipantLive = (() => {
		const uId = user?.id
		if (!uId || !room?.isLive) return false
		if (room.hostId === uId) return true
		if (room.speakers.includes(uId)) return true
		if (room.listeners.includes(uId)) return true
		return false
	})()

	const isPrivilegedMember = useMemo(() => {
		if (!chat || !user?.id) return false
		const me = chat.members.find(m => m.userId === user.id)
		if (!me) return false
		return me.role !== MemberRole.GUEST
	}, [chat, user?.id])

	const leaveLive = () => {
		live.leaveLive()
	}

	const joinLive = () => {
		live.joinLive(chatId, {
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
			live.startLive(chatId, {
				nameOfChat,
				chat: chat as ChatType,
				isPrivilegedMember,
			})
		}
	}

	const handleLeaveClick = () => {
		live.openOverlay(chatId, {
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

	const actionsForButtons = [
		() => {},
		startDialogCall,
		onToggleSideBar,
		startLive,
	]

	console.log({ isMember, members: chat?.members })

	return (
		<div className="w-full h-full flex" data-chat-room-root>
			<div className="w-full h-full flex flex-col justify-between overflow-hidden dark:bg-[#0E1621] bg-slate-100 bg-[url('/images/bg-wallpaper.jpg')] bg-no-repeat bg-cover bg-center dark:bg-[url('/')] border-r border-r-[#E7E7E7] dark:border-r-[#101921] relative">
				{isRoomLive && isParticipantLive && (
					<LiveBannerJoined
						isSelfMuted={isSelfMuted}
						participants={participants}
						nameOfChat={nameOfChat}
						handleLeaveClick={handleLeaveClick}
						maximizeWindowsLive={maximizeWindowsLive}
					/>
				)}
				<Header
					nameOfChat={nameOfChat}
					openSideBar={openSideBar}
					chatType={chat?.type as ChatRole}
					onlineOrFollowers={headerSubtitle}
					selectedMessages={selectedMessages}
					actionsForButtons={actionsForButtons}
					hasSelectedMessages={hasSelectedMessages}
					memberRole={
						chat?.members.find(m => m.userId === user?.id)?.role as MemberRole
					}
					clearSelectedMessages={clearSelectedMessages}
				/>
				{pinnedMessages && <PinnedMessage pinnedMessages={pinnedMessages} />}
				{isRoomLive && !isParticipantLive && (
					<LiveBannerJoin participants={participants} joinLive={joinLive} />
				)}

				<WrapperMessages
					chat={chat}
					locale={locale}
					selectedMessages={selectedMessages}
					hasSelectedMessages={hasSelectedMessages}
					isLoadingMessages={isLoadingMessages}
					messages={isSuccessMessages ? messages?.messages : []}
					setSelectedMessages={setSelectedMessages}
					handleEditMessage={handleEditMessage}
				/>
				{isChatLoading ? (
					<JoinChat.Skeleton />
				) : !isMember && typeOfChat !== ChatRole.DIALOG ? (
					<JoinChat
						typeOfChat={typeOfChat as ChatRole}
						chatLink={chat?.link}
						chatId={chat?.id}
					/>
				) : (
					<RichMessageInput
						chatId={chatId}
						chatType={chat?.type}
						editedMessage={editedMessage}
						handleEditMessage={handleEditMessage}
					/>
				)}
				<CallOverlay
					chat={chat}
					chatId={chatId}
					callApi={callApi}
					callState={callState}
					peerUserId={peerUserId}
					visible={callVisible || callState.phase !== CallPhaseEnum.IDLE}
					endDialogCall={endDialogCall}
				/>
				{/* LiveOverlay is rendered globally by LiveGlobalProvider */}
			</div>
			<SideBar
				user={user}
				chat={chat}
				openSideBar={openSideBar}
				onToggleSideBar={onToggleSideBar}
			/>
		</div>
	)
}
