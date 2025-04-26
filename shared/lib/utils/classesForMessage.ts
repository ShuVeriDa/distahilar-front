import { MessageType } from "@/prisma/models"
import { cn } from "./cn"

export const getMessageBackgroundClasses = (
	isMyMessage: boolean,
	isCircleVideo: boolean
) => {
	if (isCircleVideo) return ""
	return isMyMessage
		? "bg-[#EFFDDE] dark:bg-[#2B5278] rounded-l-2xl self-end"
		: "bg-white dark:bg-[#182533] rounded-r-2xl self-start"
}

export const getMessageBorderRadiusClasses = (
	isMyMessage: boolean,
	isNextMessageMine: boolean,
	isDifferentSenderPrevious: boolean,
	isFirstMessage: boolean
) => {
	if (isMyMessage) {
		return cn(
			!isNextMessageMine &&
				"rounded-tr-[6px] after:-right-[20px] after:rounded-bl-[13px]",
			isNextMessageMine && "rounded-tr-[6px] rounded-br-md",
			isDifferentSenderPrevious && "rounded-tr-[16px]",
			isFirstMessage && "rounded-tr-2xl"
		)
	} else {
		return cn(
			isNextMessageMine &&
				"rounded-tl-[6px] after:-left-[20px] after:rounded-br-[13px]",
			!isNextMessageMine && "rounded-tl-[16px] rounded-bl-md",
			isDifferentSenderPrevious && "rounded-tl-[16px]",
			isFirstMessage && "rounded-tl-2xl"
		)
	}
}

export const getMessageTailClasses = (
	isMyMessage: boolean,
	isNextMessageMine: boolean,
	isSameMessage: boolean
) => {
	return cn(
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
	)
}

export const getMessageSpacingClasses = (
	nextMessage: MessageType,
	message: MessageType,
	userId: string | undefined
) => {
	return nextMessage &&
		message &&
		(nextMessage.userId === userId) === (message.userId === userId)
		? "mb-1"
		: "mb-3"
}

export const getHighlightBorderRadiusClasses = (
	isMyMessage: boolean,
	isDifferentSenderPrevious: boolean,
	isDifferentSenderNext: boolean,
	isCircleVideo: boolean
) => {
	if (isCircleVideo) return "rounded-[16px]"
	if (isMyMessage) {
		return cn(
			"rounded-l-[16px] rounded-tr-[6px] rounded-br-[6px]",
			isDifferentSenderPrevious && "rounded-tr-[16px]",
			isDifferentSenderNext && "rounded-br-[0px]"
		)
	} else {
		return cn(
			"rounded-r-[16px] rounded-tl-[6px] rounded-bl-[6px]",
			isDifferentSenderPrevious && "rounded-tl-[16px]",
			isDifferentSenderNext && "rounded-bl-[0px]"
		)
	}
}
