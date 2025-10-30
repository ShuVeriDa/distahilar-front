import { cn } from "@/shared/lib/utils/cn"

// Функция для вычисления классов основного контейнера
export const getMainContainerClasses = ({
	isMoreTwoLine,
	isFile,
	isHasReactions,
	isMessageContent,
	isMyMessage,
	isVoice,
	isImageFile,
	isVideoFile,
}: {
	isMoreTwoLine: boolean | 0 | null
	isFile: boolean
	isHasReactions: boolean
	isMessageContent: boolean
	isMyMessage: boolean
	isVoice: boolean
	isImageFile: boolean
	isVideoFile: boolean
}) => {
	const baseClasses = "h-full flex items-end relative"

	const moreTwoLineClasses = {
		textMessage:
			isMoreTwoLine && !isFile && "justify-end absolute bottom-2 right-[12px]",
		fileMessage:
			(isMoreTwoLine || isMessageContent) &&
			isFile &&
			!isHasReactions &&
			isMessageContent &&
			"justify-end absolute bottom-2 right-0",
	}

	const fileClasses = {
		withReactionsNoContent:
			isFile &&
			isHasReactions &&
			!isMessageContent &&
			"justify-end relative bottom-0 right-0",
		withReactionsImageVideo:
			isFile &&
			isHasReactions &&
			!isMessageContent &&
			(isImageFile || isVideoFile) &&
			"justify-end bottom-0.5 px-3",
		withoutReactionsNoContent:
			isFile &&
			!isHasReactions &&
			!isMessageContent &&
			"justify-end absolute bottom-2 right-[12px]",
		withReactions: isHasReactions && isFile && "justify-between z-[20] w-full",
	}

	const messageTypeClasses = {
		myMessage: isMyMessage && !isMoreTwoLine && !isFile && " -right-2 z-[20]",
		voice: isVoice && "absolute bottom-2",
	}

	const reactionClasses = {
		withoutFile:
			isHasReactions &&
			!isFile &&
			"justify-between relative bottom-3 right-[12px] z-[20] pl-2 gap-5 w-[calc(100%+20px)]",
		notMyMessage:
			isHasReactions && !isMyMessage && !isFile && "w-[calc(100%+14px)]",
	}

	const mediaClasses = {
		withContent: (isImageFile || isVideoFile) && isMessageContent && "px-3",
		withoutContentNoFile:
			(isImageFile || isVideoFile) &&
			!isMessageContent &&
			!isFile &&
			"absolute bottom-3 right-[8px]",
		withContentNoFile:
			(isImageFile || isVideoFile) &&
			isMessageContent &&
			!isFile &&
			"absolute bottom-2 right-[12px]",
	}

	return cn(
		baseClasses,
		moreTwoLineClasses.textMessage,
		moreTwoLineClasses.fileMessage,
		fileClasses.withReactionsNoContent,
		fileClasses.withReactionsImageVideo,
		fileClasses.withoutReactionsNoContent,
		fileClasses.withReactions,
		messageTypeClasses.myMessage,
		messageTypeClasses.voice,
		reactionClasses.withoutFile,
		reactionClasses.notMyMessage,
		mediaClasses.withContent,
		mediaClasses.withoutContentNoFile,
		mediaClasses.withContentNoFile
	)
}

// Функция для вычисления классов контейнера с временем и статусом
export const getTimeContainerClasses = ({
	isCircleVideo,
	isImageFile,
	isVideoFile,
	isMessageContent,
	isHasReactions,
	isFile,
}: {
	isCircleVideo: boolean
	isImageFile: boolean
	isVideoFile: boolean
	isMessageContent: boolean
	isHasReactions: boolean
	isFile: boolean
}) => {
	const baseClasses = " flex gap-1.5 items-center relative top-1.5 "

	const backgroundClasses = {
		circleVideo:
			isCircleVideo &&
			"dark:bg-[rgba(0,0,0,0.3)] bg-green-900/30 py-0.5 px-1.5 rounded-md absolute",
		mediaWithoutContent:
			(isImageFile || isVideoFile) &&
			!isMessageContent &&
			!isHasReactions &&
			"dark:bg-[rgba(0,0,0,0.3)] bg-green-900/30 py-0.5 px-1.5 rounded-md absolute",
	}

	const positionClasses = {
		circleVideoNoReactions:
			isCircleVideo && !isHasReactions && !isFile && "top-[230px]",
		reactionsNoFile:
			isHasReactions && !isFile && "absolute right-0 -bottom-[17px]",
		mediaNoContentNoReactions:
			(isImageFile || isVideoFile) &&
			!isMessageContent &&
			!isHasReactions &&
			"top-[calc(100%-20px)] right-0",
	}

	return cn(
		baseClasses,
		backgroundClasses.circleVideo,
		backgroundClasses.mediaWithoutContent,
		positionClasses.circleVideoNoReactions,
		positionClasses.reactionsNoFile,
		positionClasses.mediaNoContentNoReactions
	)
}

// Функция для вычисления классов текста времени
export const getTimeTextClasses = ({
	isMyMessage,
	isCircleVideo,
	isImageFile,
	isVideoFile,
	isMessageContent,
	isHasReactions,
}: {
	isMyMessage: boolean
	isCircleVideo: boolean
	isImageFile: boolean
	isVideoFile: boolean
	isMessageContent: boolean
	isHasReactions: boolean
}) => {
	const baseClasses = "text-[12px] leading-5"

	const colorClasses = {
		myMessage:
			isMyMessage && (isCircleVideo || isVideoFile || isImageFile)
				? "text-white"
				: isMyMessage
				? "text-[#6DB566] dark:text-[#488DD3]"
				: "text-[#A0ACB6] dark:text-[#6D7F8F]",
		circleVideo: isCircleVideo && "text-white",
		mediaWithoutContent:
			(isImageFile || isVideoFile) &&
			!isMessageContent &&
			!isHasReactions &&
			"text-white",
	}

	return cn(
		baseClasses,
		colorClasses.myMessage,
		colorClasses.circleVideo,
		colorClasses.mediaWithoutContent
	)
}
