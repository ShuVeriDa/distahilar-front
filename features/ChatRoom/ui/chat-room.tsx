"use client"

import { useFetchChatByIdQuery } from "@/shared/lib/services/chat/useChatQuery"
import { useMessagesWSQuery } from "@/shared/lib/services/message/useMessagesQuery"
import { FC } from "react"
import { Messages } from "../entities/Messages"
import { PinnedMessage } from "../shared/ui/PinnedMessage"
import { Header } from "../widgets/header"

interface IChatRoomProps {
	chatId: string
	locale: string
}

export const ChatRoom: FC<IChatRoomProps> = ({ chatId, locale }) => {
	const { data: chat } = useFetchChatByIdQuery(chatId)
	const {
		data: messages,
		isSuccess: isSuccessMessages,
		isLoading,
	} = useMessagesWSQuery(chatId)
	const pinnedMessages = messages?.messages.find(msg => msg.isPinned)

	return (
		<div className="w-full h-screen overflow-y-auto flex flex-col dark:bg-[#0E1621] bg-slate-100 bg-[url('/images/bg-wallpaper.jpg')] bg-no-repeat bg-cover bg-center">
			<Header chat={chat} />
			{pinnedMessages && <PinnedMessage pinnedMessages={pinnedMessages} />}
			<Messages
				messages={isSuccessMessages ? messages?.messages : []}
				locale={locale}
			/>
		</div>
	)
}
