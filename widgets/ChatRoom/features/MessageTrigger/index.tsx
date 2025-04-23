"use client"

import { MessageEnum, MessageType } from "@/prisma/models"
import { cn } from "@/shared/lib/utils/cn"
import { ContextMenuTrigger } from "@/shared/ui/ContenxtMenu/context-menu"
import { FC, useEffect, useRef, useState } from "react"
import { FaCheck } from "react-icons/fa6"
import { Message } from "./Message"

interface IMessageTriggerProps {
	message: MessageType
	nextMessage: MessageType
	previousMessage: MessageType
	userId: string | undefined
	hasSelectedMessages: boolean
	isSameMessage: boolean
	isFirstMessage: boolean
	isLastMessage: boolean
}

export const MessageTrigger: FC<IMessageTriggerProps> = ({
	message,
	nextMessage,
	previousMessage,
	userId,
	hasSelectedMessages,
	isSameMessage,
	isFirstMessage,
	isLastMessage,
}) => {
	const ref = useRef<HTMLDivElement>(null)
	const [height, setHeight] = useState<number | null>(null)

	useEffect(() => {
		if (ref.current) {
			setHeight(ref.current.offsetHeight)
		}
	}, [message])

	const isMyMessage = message.userId === userId
	const isNextMessageMine = nextMessage && nextMessage.userId === userId
	const isDifferentSenderPrevious =
		previousMessage && previousMessage.userId !== message.userId
	const isMoreTwoLine = height && height > 36
	const isVoice = message.messageType === MessageEnum.VOICE
	const isCircleVideo = message.messageType === MessageEnum.VIDEO
	// const isHasReactions = true
	const isHasReactions = message.reactions?.length > 0
	const isDifferentSenderNext =
		nextMessage && nextMessage.userId !== message.userId

	return (
		<div className="w-full flex justify-between items-end">
			<ContextMenuTrigger
				className={cn(
					"flex w-full",
					isMyMessage && "justify-end",
					!isMyMessage && "justify-start"
				)}
			>
				<Message
					ref={ref}
					message={message}
					nextMessage={nextMessage}
					userId={userId}
					isNextMessageMine={isNextMessageMine}
					isVoice={isVoice}
					isCircleVideo={isCircleVideo}
					isMoreTwoLine={isMoreTwoLine}
					isMyMessage={isMyMessage}
					isHasReactions={isHasReactions}
					isSameMessage={isSameMessage}
					isDifferentSenderNext={isDifferentSenderNext}
					isDifferentSenderPrevious={isDifferentSenderPrevious}
					isFirstMessage={isFirstMessage}
				/>
			</ContextMenuTrigger>

			{hasSelectedMessages && (
				<div
					className={cn(
						"flex justify-center items-center bg-[#8EA97A] w-full max-w-[22px] h-[22px] rounded-full ml-[6px] mb-2 border-[2px] border-white",
						// height && height > 40 && "mb-3",
						(isDifferentSenderNext || isLastMessage) && "mb-4",
						isSameMessage && "bg-[#4AB44A] pt-0.5"
					)}
				>
					{isSameMessage && <FaCheck color="white" size={14} />}
				</div>
			)}
		</div>
	)
}
