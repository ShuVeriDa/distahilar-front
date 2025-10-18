"use client"

import { MediaType, MediaTypeEnum, MessageType } from "@/prisma/models"
import { Skeleton, Typography } from "@/shared"
import { cn } from "@/shared/lib/utils/cn"

import { ISlideImage } from "@/features/LightBox/ui/LightBox"
import { IVideoLightBox } from "@/features/VideoPlayer/ui"
import {
	getHighlightBorderRadiusClasses,
	getMessageBackgroundClasses,
	getMessageBorderRadiusClasses,
	getMessageSpacingClasses,
	getMessageTailClasses,
} from "@/shared/lib/utils/classesForMessage"
import { RefObject } from "react"
import { MessageFile } from "../../MessageFile"
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
	allImages: ISlideImage[]
	allVideos: IVideoLightBox[]
}

export const Message = ({
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
	allImages,
	allVideos,
}: IMessageProps) => {
	const media = message.media?.length ? message.media[0] : null
	const isMessageContent = !!message.content
	const isImageFile = isFile && media?.type === MediaTypeEnum.IMAGE
	const isVideoFile = isFile && media?.type === MediaTypeEnum.VIDEO
	const isFileFile = isFile && media?.type === MediaTypeEnum.FILE

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
			"flex-col gap-2 pb-0": isHasReactions && !isFile,
			"flex-col gap-0 pb-0": isHasReactions && isFile,
			"pb-2 w-full max-w-[280px]": isVoice,
			"bg-transparent after:hidden":
				isCircleVideo ||
				((isImageFile || isVideoFile) && !isMessageContent && !isHasReactions),
			"min-w-[270px] pb-2": isFile && isFileFile,
			// "min-w-[270px] pb-2": isFile && isFileFile && isMessageContent,
			"w-auto h-auto max-w-sm max-h-sm p-0":
				isFile &&
				(media?.type === MediaTypeEnum.IMAGE ||
					media?.type === MediaTypeEnum.VIDEO) &&
				!isMessageContent,
			"w-auto h-auto max-w-sm max-h-sm pt-0 pb-2 px-0":
				isFile &&
				(media?.type === MediaTypeEnum.IMAGE ||
					media?.type === MediaTypeEnum.VIDEO) &&
				isMessageContent,
			"pb-2": isFile && isHasReactions,
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
				<div
					className={cn(
						isMessageContent && isFile && "flex flex-col-reverse gap-2 "
					)}
				>
					{isMessageContent && !isVoice && !isCircleVideo && (
						<Typography
							tag="p"
							className={cn(
								"text-[14px] leading-5 flex justify-self-end",
								(isImageFile || isVideoFile) && isMessageContent && "px-3"
							)}
						>
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
						<MessageFile
							isMessageContent={isMessageContent}
							isHasReactions={isHasReactions}
							message={message}
							allImages={allImages}
							allVideos={allVideos}
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
					media={media as MediaType | null}
					isFile={isFile}
					isMessageContent={isMessageContent}
				/>
			</div>
		</>
	)
}

Message.displayName = "Message"

interface IMessageSkeleton {
	isMyMessage: boolean
	isNextMessageMine: boolean
	isDifferentSenderPrevious: boolean
	isFirstMessage: boolean
	isSameMessage: boolean
}

Message.Skeleton = function MessageSkeleton({
	isMyMessage,
	isDifferentSenderPrevious,
	isFirstMessage,
	isNextMessageMine,
	isSameMessage,
}: IMessageSkeleton) {
	return (
		<div
			className={cn(
				"flex w-full",
				isMyMessage && "justify-end",
				!isMyMessage && "justify-start"
			)}
		>
			<Skeleton
				className={cn(
					"relative w-[40%] h-[36px] px-3 py-2 flex gap-3",
					isMyMessage
						? "bg-[#EFFDDE] dark:bg-[#2B5278] rounded-l-2xl self-end"
						: "bg-white dark:bg-[#182533] rounded-r-2xl self-start",
					isMyMessage
						? cn(
								!isNextMessageMine &&
									"rounded-tr-[6px] after:-right-[20px] after:rounded-bl-[13px]",
								isNextMessageMine && "rounded-tr-[6px] rounded-br-md",
								isDifferentSenderPrevious && "rounded-tr-[16px]",
								isFirstMessage && "rounded-tr-2xl"
						  )
						: cn(
								isNextMessageMine &&
									"rounded-tl-[6px] after:-left-[20px] after:rounded-br-[13px]",
								!isNextMessageMine && "rounded-tl-[16px] rounded-bl-md",
								isDifferentSenderPrevious && "rounded-tl-[16px]",
								isFirstMessage && "rounded-tl-2xl"
						  ),
					isMyMessage
						? cn(
								!isNextMessageMine &&
									"rounded-tr-[6px] after:-right-[20px] after:rounded-bl-[13px]",
								isNextMessageMine && "rounded-tr-[6px] rounded-br-md",
								isDifferentSenderPrevious && "rounded-tr-[16px]",
								isFirstMessage && "rounded-tr-2xl"
						  )
						: cn(
								isNextMessageMine &&
									"rounded-tl-[6px] after:-left-[20px] after:rounded-br-[13px]",
								!isNextMessageMine && "rounded-tl-[16px] rounded-bl-md",
								isDifferentSenderPrevious && "rounded-tl-[16px]",
								isFirstMessage && "rounded-tl-2xl"
						  ),
					"after:absolute after:w-[20px] after:h-[13px] after:bottom-0 after:transparent",
					isMyMessage &&
						!isNextMessageMine &&
						(isSameMessage
							? "after:shadow-[-13px_0_0_0_#B9D8E5]"
							: "after:shadow-[-13px_0_0_0_#EFFDDE] dark:after:shadow-[-13px_0_0_0_#2B5278]"),
					!isMyMessage &&
						isNextMessageMine &&
						(isSameMessage
							? "after:shadow-[13px_0_0_0_#C4D9FC]"
							: "after:shadow-[13px_0_0_0_#ffffff] dark:after:shadow-[13px_0_0_0_#182533]")
				)}
			/>
		</div>
	)
}
