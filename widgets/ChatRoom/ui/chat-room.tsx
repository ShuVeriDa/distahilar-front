"use client"

import { useFetchChatByIdQuery } from "@/shared/lib/services/chat/useChatQuery"
import { useMessagesWSQuery } from "@/shared/lib/services/message/useMessagesQuery"
import { FC, useState } from "react"

import { MessageType } from "@/prisma/models"
import { useUser, useWebRTCCall } from "@/shared"
import { useSelectedMessages } from "@/shared/hooks/useSelectedMessages"

import { CallPhaseEnum } from "@/shared/lib/services/call/call.types"
import { WrapperMessages } from "../entities"
import { Header } from "../entities/Header"
import { SideBar } from "../entities/Sidebar"
import { RichMessageInput } from "../features"
import { PinnedMessage } from "../shared/ui/PinnedMessage"
import { CallOverlay } from "./call-overlay"

interface IChatRoomProps {
	chatId: string
	locale: string
}

export const ChatRoom: FC<IChatRoomProps> = ({ chatId, locale }) => {
	const { user } = useUser()
	const [openSideBar, setOpenSideBar] = useState(false)
	const [editedMessage, setEditedMessage] = useState<MessageType | null>(null)
	const [callVisible, setCallVisible] = useState(false)
	const { data: chat } = useFetchChatByIdQuery(chatId)
	const [callState, callApi] = useWebRTCCall()

	const peerUserId =
		chat?.members?.find(m => m.userId !== user?.id)?.userId || null

	const onToggleSideBar = () => setOpenSideBar(!openSideBar)

	const handleEditMessage = (message: MessageType | null) =>
		setEditedMessage(message)

	const startDialogCall = () => setCallVisible(true)
	const endDialogCall = () => setCallVisible(false)

	const actionsForButtons = [() => {}, startDialogCall, onToggleSideBar]

	const {
		hasSelectedMessages,
		selectedMessages,
		setSelectedMessages,
		clearSelectedMessages,
	} = useSelectedMessages()
	const {
		data: messages,
		isSuccess: isSuccessMessages,
		// isLoading,
	} = useMessagesWSQuery(chatId)
	const pinnedMessages = messages?.messages.find(msg => msg.isPinned)

	return (
		<div className="w-full h-full flex ">
			<div className="w-full h-full flex flex-col justify-between overflow-hidden dark:bg-[#0E1621] bg-slate-100 bg-[url('/images/bg-wallpaper.jpg')] bg-no-repeat bg-cover bg-center dark:bg-[url('/')] border-r border-r-[#E7E7E7] dark:border-r-[#101921] relative">
				<Header
					chat={chat}
					user={user}
					hasSelectedMessages={hasSelectedMessages}
					selectedMessages={selectedMessages}
					actionsForButtons={actionsForButtons}
					clearSelectedMessages={clearSelectedMessages}
					openSideBar={openSideBar}
				/>
				{pinnedMessages && <PinnedMessage pinnedMessages={pinnedMessages} />}
				<WrapperMessages
					chat={chat}
					locale={locale}
					messages={isSuccessMessages ? messages?.messages : []}
					hasSelectedMessages={hasSelectedMessages}
					selectedMessages={selectedMessages}
					setSelectedMessages={setSelectedMessages}
					handleEditMessage={handleEditMessage}
				/>
				<RichMessageInput
					chatId={chatId}
					chatType={chat?.type}
					editedMessage={editedMessage}
					handleEditMessage={handleEditMessage}
				/>
				<CallOverlay
					callState={callState}
					callApi={callApi}
					visible={callVisible || callState.phase !== CallPhaseEnum.IDLE}
					peerUserId={peerUserId}
					chatId={chatId}
					chat={chat}
					endDialogCall={endDialogCall}
				/>
			</div>
			<SideBar
				openSideBar={openSideBar}
				user={user}
				chat={chat}
				onToggleSideBar={onToggleSideBar}
			/>
		</div>
	)
}
