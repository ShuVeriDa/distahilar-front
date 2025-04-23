"use client"

import { useUser } from "@/shared"
import { useScrollToLastMessage } from "@/shared/hooks/useScrollToLastMessage"

import { ChatType, MessageType } from "@/prisma/models"
import { Dispatch, FC, SetStateAction } from "react"

import { Messages } from "./Messages"

interface IWrapperMessagesProps {
	messages: MessageType[]
	selectedMessages: MessageType[]
	hasSelectedMessages: boolean
	locale: string
	setSelectedMessages: Dispatch<SetStateAction<MessageType[]>>
	chat: ChatType | undefined
}

export const WrapperMessages: FC<IWrapperMessagesProps> = ({
	messages,
	locale,
	hasSelectedMessages,
	selectedMessages,
	chat,
	setSelectedMessages,
}) => {
	const { containerRef } = useScrollToLastMessage(messages)
	const { user } = useUser()
	const userId = user?.id

	return (
		<div
			ref={containerRef}
			className="w-full h-full overflow-y-auto flex flex-1 flex-col  px-5 py-3"
		>
			{messages.map((message, index) => {
				return (
					<Messages
						key={message.id}
						message={message}
						userId={userId}
						index={index}
						messages={messages}
						selectedMessages={selectedMessages}
						hasSelectedMessages={hasSelectedMessages}
						setSelectedMessages={setSelectedMessages}
						locale={locale}
						chat={chat}
					/>
				)
			})}
		</div>
	)
}
