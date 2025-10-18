"use client"

import { useUser } from "@/shared"
import { useScrollToLastMessage } from "@/shared/hooks/useScrollToLastMessage"

import { ChatType, MessageType } from "@/prisma/models"
import { Dispatch, FC, SetStateAction } from "react"

import { cn } from "@/shared/lib/utils/cn"
import { Message } from "../../features"
import { Messages } from "./Messages"

interface IWrapperMessagesProps {
	locale: string
	messages: MessageType[]
	chat: ChatType | undefined
	isLoadingMessages: boolean
	hasSelectedMessages: boolean
	selectedMessages: MessageType[]
	setSelectedMessages: Dispatch<SetStateAction<MessageType[]>>
	handleEditMessage: (message: MessageType | null) => void
}

export const WrapperMessages: FC<IWrapperMessagesProps> = ({
	chat,
	locale,
	messages,
	selectedMessages,
	isLoadingMessages,
	hasSelectedMessages,
	handleEditMessage,
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
			{!isLoadingMessages ? (
				messages.map((message, index) => {
					return (
						<Messages
							key={message.id}
							message={message}
							userId={userId}
							index={index}
							messages={messages}
							selectedMessages={selectedMessages}
							hasSelectedMessages={hasSelectedMessages}
							locale={locale}
							chat={chat}
							setSelectedMessages={setSelectedMessages}
							handleEditMessage={handleEditMessage}
						/>
					)
				})
			) : (
				<div className={cn("w-full flex justify-between items-end")}>
					<div className="w-full flex flex-col gap-3">
						{Array.from({ length: 8 }).map((_, i) => {
							const isEqualZero = i % 2 === 0
							return (
								<Message.Skeleton
									key={i}
									isFirstMessage
									isSameMessage={false}
									isMyMessage={isEqualZero ? true : false}
									isNextMessageMine={isEqualZero ? false : true}
									isDifferentSenderPrevious={isEqualZero ? false : true}
								/>
							)
						})}
					</div>
				</div>
			)}
		</div>
	)
}
