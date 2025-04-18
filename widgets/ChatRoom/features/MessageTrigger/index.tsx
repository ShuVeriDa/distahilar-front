"use client"

import { MessageEnum, MessageType } from "@/prisma/models"
import { cn } from "@/shared/lib/utils/cn"
import { ContextMenuTrigger } from "@/shared/ui/ContenxtMenu/context-menu"
import { FC, useEffect, useRef, useState } from "react"
import { Message } from "./Message"

interface IMessageTriggerProps {
	message: MessageType
	nextMessage: MessageType
	userId: string | undefined
}

export const MessageTrigger: FC<IMessageTriggerProps> = ({
	message,

	nextMessage,

	userId,
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
	const isMoreTwoLine = height && height > 36
	const isVoice = message.messageType === MessageEnum.VOICE
	const isCircleVideo = message.messageType === MessageEnum.VIDEO
	// const isHasReactions = true
	const isHasReactions = message.reactions?.length > 0

	return (
		<>
			<ContextMenuTrigger
				className={cn(
					"flex",
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
				/>
			</ContextMenuTrigger>
		</>
	)
}
