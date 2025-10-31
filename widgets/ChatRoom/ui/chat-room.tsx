"use client"

import { useFetchChatByIdQuery } from "@/shared/lib/services/chat/useChatQuery"
import { useMessagesWSQuery } from "@/shared/lib/services/message/useMessagesQuery"
import { FC } from "react"

import { ChatRole, MemberRole } from "@/prisma/models"
import { useUser, useWebRTCCall } from "@/shared"
import { useSelectedMessages } from "@/shared/hooks/useSelectedMessages"

import { useChatInfo } from "@/shared/hooks/useChatInfo"
import { CallPhaseEnum } from "@/shared/lib/services/call/call.types"
import { WrapperMessages } from "../entities"
import { Header } from "../entities/Header"
import { SideBar } from "../entities/Sidebar"
import { RichMessageInput } from "../features"
import { JoinChat } from "../features/JoinChat"
import { useChatRoomComputed } from "../shared/hooks/useChatRoomComputed"
import { useChatRoomLive } from "../shared/hooks/useChatRoomLive"
import { useChatRoomNavigation } from "../shared/hooks/useChatRoomNavigation"
import { useChatRoomState } from "../shared/hooks/useChatRoomState"
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
	const resolvedChatId = chat?.id || chatId
	const [callState, callApi] = useWebRTCCall()

	const {
		onlineOrFollowers,
		nameOfChat,
		isOwner,
		isAdmin,
		isModerator,
		isOnline,
	} = useChatInfo(chat, user)

	const {
		openSideBar,
		editedMessage,
		replyMessage,
		callVisible,
		onToggleSideBar,
		handleEditMessage,
		handleReplyMessage,
		startDialogCall,
		endDialogCall,
	} = useChatRoomState()

	const {
		hasSelectedMessages,
		selectedMessages,
		setSelectedMessages,
		clearSelectedMessages,
	} = useSelectedMessages()

	const messagesQuery = useMessagesWSQuery(resolvedChatId)
	const flatMessages = messagesQuery.flatMessages
	const isLoadingMessages = messagesQuery.isLoading
	const hasNextPage = messagesQuery.hasNextPage as boolean
	const fetchNextPage = messagesQuery.fetchNextPage
	const isFetchingNextPage = messagesQuery.isFetchingNextPage

	const {
		isRoomLive,
		isParticipantLive,
		participants,
		isSelfMuted,
		maximizeWindowsLive,
		joinLive,
		startLive,
		handleLeaveClick,
	} = useChatRoomLive({
		chat,
		user,
		resolvedChatId,
		nameOfChat,
		isOwner,
		isAdmin,
		isModerator,
	})

	const { peerUserId, isMember, typeOfChat, pinnedMessages, headerSubtitle } =
		useChatRoomComputed({
			chat,
			user,
			flatMessages,
			isRoomLive,
			onlineOrFollowers,
		})

	useChatRoomNavigation({
		chatId,
		chat,
		locale,
		flatMessages,
	})

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
					isOnline={isOnline}
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
					messages={flatMessages}
					onLoadMore={() => {
						if (hasNextPage && !isFetchingNextPage) fetchNextPage()
					}}
					hasNextPage={!!hasNextPage}
					isFetchingNextPage={isFetchingNextPage}
					setSelectedMessages={setSelectedMessages}
					handleEditMessage={handleEditMessage}
					handleReplyMessage={handleReplyMessage}
				/>
				{isChatLoading ? (
					<JoinChat.Skeleton />
				) : !isMember && typeOfChat !== ChatRole.DIALOG ? (
					<JoinChat
						typeOfChat={typeOfChat as ChatRole}
						chatLink={chat?.link}
						chatId={chat?.id}
					/>
				) : typeOfChat === ChatRole.CHANNEL && !isOwner && !isAdmin ? (
					<div className="w-full h-[48px] bg-white dark:bg-[#17212B] border-t border-t-[#E7E7E7] dark:border-t-[#101921] " />
				) : (
					<RichMessageInput
						chatId={resolvedChatId}
						chatType={chat?.type}
						editedMessage={editedMessage}
						handleEditMessage={handleEditMessage}
						replyMessage={replyMessage}
						handleReplyMessage={handleReplyMessage}
					/>
				)}
				<CallOverlay
					chat={chat}
					chatId={resolvedChatId}
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
