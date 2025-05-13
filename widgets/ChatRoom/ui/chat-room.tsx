"use client"

import { useFetchChatByIdQuery } from "@/shared/lib/services/chat/useChatQuery"
import { useMessagesWSQuery } from "@/shared/lib/services/message/useMessagesQuery"
import { FC } from "react"

import { useSelectedMessages } from "@/shared/hooks/useSelectedMessages"
import { WrapperMessages } from "../entities"
import { Header } from "../entities/Header"
import { RichMessageInput } from "../features"
import { PinnedMessage } from "../shared/ui/PinnedMessage"

interface IChatRoomProps {
	chatId: string
	locale: string
}

export const ChatRoom: FC<IChatRoomProps> = ({ chatId, locale }) => {
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

	console.log({ messages })

	return (
		<div className="w-full h-full  flex flex-col justify-between overflow-hidden dark:bg-[#0E1621] bg-slate-100 bg-[url('/images/bg-wallpaper.jpg')] bg-no-repeat bg-cover bg-center dark:bg-[url('/')]">
			<Header
				chat={chat}
				hasSelectedMessages={hasSelectedMessages}
				selectedMessages={selectedMessages}
				clearSelectedMessages={clearSelectedMessages}
			/>
			{pinnedMessages && <PinnedMessage pinnedMessages={pinnedMessages} />}
			<WrapperMessages
				messages={isSuccessMessages ? messages?.messages : []}
				locale={locale}
				hasSelectedMessages={hasSelectedMessages}
				selectedMessages={selectedMessages}
				setSelectedMessages={setSelectedMessages}
				chat={chat}
			/>
			<RichMessageInput chatId={chatId} />
		</div>
	)
}
