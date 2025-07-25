"use client"

import { ISlideImage } from "@/features/LightBox/ui/LightBox"
import { IVideoLightBox } from "@/features/VideoPlayer/ui"
import { MessageEnum, MessageType } from "@/prisma/models"
import { cn } from "@/shared/lib/utils/cn"
import { ContextMenuTrigger } from "@/shared/ui/ContenxtMenu/context-menu"
import { AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { FC, useEffect, useRef, useState } from "react"
import { FaCheck } from "react-icons/fa6"
import { Message } from "./Message"

const MotionDiv = dynamic(() =>
	import("framer-motion").then(mod => mod.motion.div)
)

interface IMessageTriggerProps {
	message: MessageType
	nextMessage: MessageType
	previousMessage: MessageType
	userId: string | undefined
	hasSelectedMessages: boolean
	isSameMessage: boolean
	isFirstMessage: boolean
	isLastMessage: boolean
	allImages: ISlideImage[]
	allVideos: IVideoLightBox[]
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
	allImages,
	allVideos,
}) => {
	const ref = useRef<HTMLDivElement>(null)
	const [height, setHeight] = useState<number | null>(null)

	useEffect(() => {
		if (ref.current) {
			setHeight(ref.current.offsetHeight)
		}
	}, [message.id])

	const isMyMessage = message.userId === userId
	const isNextMessageMine = nextMessage?.userId === userId
	const isDifferentSenderPrevious = previousMessage?.userId !== message.userId
	const isMoreTwoLine = height ? height > 36 : false
	const isVoice = message.messageType === MessageEnum.VOICE
	const isCircleVideo = message.messageType === MessageEnum.VIDEO
	const isFile = message.messageType === MessageEnum.FILE
	const isHasReactions = message.reactions?.length > 0
	const isDifferentSenderNext = nextMessage?.userId !== message.userId

	const containerClasses = cn(
		"flex w-full",
		isMyMessage && "justify-end",
		!isMyMessage && "justify-start"
	)

	const indicatorClasses = cn(
		"flex justify-center items-center bg-[#8EA97A] w-full max-w-[22px] h-[22px] rounded-full ml-[6px] mb-2 border-[2px] border-white",
		(isDifferentSenderNext || isLastMessage) && "mb-4",
		isSameMessage && "bg-[#4AB44A] pt-0.5"
	)

	return (
		<div className="w-full flex justify-between items-end">
			<ContextMenuTrigger className={containerClasses}>
				<Message
					ref={ref}
					message={message}
					nextMessage={nextMessage}
					userId={userId}
					isNextMessageMine={isNextMessageMine}
					isFile={isFile}
					isVoice={isVoice}
					isCircleVideo={isCircleVideo}
					isMoreTwoLine={isMoreTwoLine}
					isMyMessage={isMyMessage}
					isHasReactions={isHasReactions}
					isSameMessage={isSameMessage}
					isDifferentSenderNext={isDifferentSenderNext}
					isDifferentSenderPrevious={isDifferentSenderPrevious}
					isFirstMessage={isFirstMessage}
					allImages={allImages}
					allVideos={allVideos}
				/>
			</ContextMenuTrigger>
			<AnimatePresence>
				{hasSelectedMessages && (
					<MotionDiv
						key="selected-message-indicator"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 20 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className={indicatorClasses}
					>
						{isSameMessage && <FaCheck color="white" size={14} />}
					</MotionDiv>
				)}
			</AnimatePresence>
		</div>
	)
}

MessageTrigger.displayName = "MessageTrigger"
