"use client"

import { MessageType } from "@/prisma/models"
import { Typography } from "@/shared"
import { cn } from "@/shared/lib/utils/cn"

import {
	getHighlightBorderRadiusClasses,
	getMessageBackgroundClasses,
	getMessageBorderRadiusClasses,
	getMessageSpacingClasses,
	getMessageTailClasses,
} from "@/shared/lib/utils/classesForMessage"
import { FileItem } from "@/widgets/ModalAddFile/features/Fileitem"
import { FC, RefObject } from "react"
import { MessageVoice } from "../../MessageVoice"
import { VideoMessage } from "../../VideoMessage"
import { MessageInfo } from "./shared/ui/MessageInfo"

interface IMessageProps {
	message: MessageType
	nextMessage: MessageType
	isFile: boolean
	isCircleVideo: boolean
	isVoice: boolean
	isMyMessage: boolean
	isHasReactions: boolean
	isMoreTwoLine: boolean | 0 | null
	isNextMessageMine: boolean
	ref: RefObject<HTMLDivElement>
	userId: string | undefined
	isSameMessage: boolean
	isDifferentSenderNext: boolean
	isDifferentSenderPrevious: boolean
	isFirstMessage: boolean
}

export const Message: FC<IMessageProps> = ({
	message,
	nextMessage,
	isFile,
	isCircleVideo,
	isVoice,
	isMoreTwoLine,
	isMyMessage,
	isNextMessageMine,
	isHasReactions,
	userId,
	ref,
	isSameMessage,
	isDifferentSenderNext,
	isDifferentSenderPrevious,
	isFirstMessage,
}) => {
	const messageClasses = cn(
		"relative min-w-[80px] w-fit px-3 py-2 flex max-w-[70%] gap-3",
		getMessageBackgroundClasses(isMyMessage, isCircleVideo),
		getMessageBorderRadiusClasses(
			isMyMessage,
			isNextMessageMine,
			isDifferentSenderPrevious,
			isFirstMessage
		),
		getMessageTailClasses(isMyMessage, isNextMessageMine, isSameMessage),
		getMessageSpacingClasses(nextMessage, message, userId),
		{
			"flex-col gap-0 pb-5": isMoreTwoLine,
			"flex-col gap-2 pb-0": isHasReactions,
			"pb-2 w-full max-w-[280px]": isVoice,
			"bg-transparent after:hidden": isCircleVideo,
			"min-w-[270px] pb-2": isFile,
		}
	)

	const highlightClasses = cn(
		"absolute inset-0 bg-blue-500 bg-opacity-30 rounded-lg pointer-events-none",
		getHighlightBorderRadiusClasses(
			isMyMessage,
			isDifferentSenderPrevious,
			isDifferentSenderNext,
			isCircleVideo
		)
	)

	return (
		<>
			<div ref={ref} className={messageClasses}>
				<div>
					{message.content && !isVoice && !isCircleVideo && !isFile && (
						<Typography tag="p" className="text-[14px] leading-5">
							{message.content}
						</Typography>
					)}
					{isVoice && (
						<MessageVoice
							voice={message.voiceMessages}
							isMyMessage={isMyMessage}
						/>
					)}
					{isCircleVideo && <VideoMessage video={message.videoMessages} />}
					{isFile && (
						<FileItem
							name={message.media[0].name ?? "название файла"}
							size={message.media[0].size ?? 0}
							variant="message"
						/>
					)}
				</div>

				{isSameMessage && <div className={highlightClasses} />}

				<MessageInfo
					message={message}
					isCircleVideo={isCircleVideo}
					isMoreTwoLine={isMoreTwoLine}
					isMyMessage={isMyMessage}
					isHasReactions={isHasReactions}
					isVoice={isVoice}
					userId={userId}
				/>
			</div>
		</>
	)
}
