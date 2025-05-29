"use client"

import { useFetchChatByIdQuery } from "@/shared/lib/services/chat/useChatQuery"
import { useMessagesWSQuery } from "@/shared/lib/services/message/useMessagesQuery"
import { FC, useState } from "react"

import { useUser } from "@/shared"
import { useSelectedMessages } from "@/shared/hooks/useSelectedMessages"
import { WrapperMessages } from "../entities"
import { Header } from "../entities/Header"
import { SideBar } from "../entities/Sidebar"
import { RichMessageInput } from "../features"
import { PinnedMessage } from "../shared/ui/PinnedMessage"

interface IChatRoomProps {
	chatId: string
	locale: string
}

export const ChatRoom: FC<IChatRoomProps> = ({ chatId, locale }) => {
	const [openSideBar, setOpenSideBar] = useState(false)
	const { user } = useUser()

	const onToggleSideBar = () => setOpenSideBar(!openSideBar)
	const actionsForButtons = [onToggleSideBar]

	const {
		hasSelectedMessages,
		selectedMessages,
		setSelectedMessages,
		clearSelectedMessages,
	} = useSelectedMessages()

	const { data: chat } = useFetchChatByIdQuery(chatId)
	const {
		data: messages,
		isSuccess: isSuccessMessages,
		// isLoading,
	} = useMessagesWSQuery(chatId)
	const pinnedMessages = messages?.messages.find(msg => msg.isPinned)

	return (
		<div className="w-full h-full  flex ">
			<div className="w-full h-full  flex flex-col justify-between overflow-hidden  dark:bg-[#0E1621] bg-slate-100 bg-[url('/images/bg-wallpaper.jpg')] bg-no-repeat bg-cover bg-center dark:bg-[url('/')] border-r border-r-[#E7E7E7] dark:border-r-[#101921]">
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
				/>
				<RichMessageInput chatId={chatId} chatType={chat?.type} />
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
