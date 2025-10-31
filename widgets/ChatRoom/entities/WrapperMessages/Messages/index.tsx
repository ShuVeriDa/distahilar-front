import { Typography } from "@/shared"
import { Dispatch, FC, memo, SetStateAction, useCallback, useMemo } from "react"

import {
	ChatMemberType,
	ChatType,
	MediaTypeEnum,
	MessageType,
} from "@/prisma/models"
import { formatTime } from "@/shared/lib/utils/formatTime"
import { ContextMenu } from "@/shared/ui/ContenxtMenu/context-menu"
import { MessageMenu } from "@/widgets/ChatRoom/features/MessageMenu"
import { MessageTrigger } from "@/widgets/ChatRoom/features/MessageTrigger"

interface IMessagesProps {
	message: MessageType
	userId: string | undefined
	messages: MessageType[]
	index: number
	selectedMessages: MessageType[]
	hasSelectedMessages: boolean
	locale: string
	chat: ChatType | undefined
	setSelectedMessages: Dispatch<SetStateAction<MessageType[]>>
	handleEditMessage: (message: MessageType | null) => void
	handleReplyMessage: (message: MessageType | null) => void
	handleScrollToReply: (repliedToId: string) => void
	highlightedMessageId: string | null
}

const MessagesComponent: FC<IMessagesProps> = ({
	index,
	userId,
	message,
	messages,
	hasSelectedMessages,
	locale,
	selectedMessages,
	chat,
	setSelectedMessages,
	handleEditMessage,
	handleReplyMessage,
	handleScrollToReply,
	highlightedMessageId,
}) => {
	const isFirstMessage = index === 0
	const isLastMessage = index === messages.length - 1
	const isSameMessage = selectedMessages.some(item => item.id === message.id)
	const isMyMessage = message.userId === userId
	const previousMessage = messages[index - 1]
	const nextMessage = messages[index + 1]
	const formattedDate = formatTime(message.createdAt, "Month number", locale)
	const createdDate = formatTime(message.createdAt, "forMessage", locale)

	const { allImages, allVideos, interlocutorsName } = useMemo(() => {
		const images = messages
			.filter(
				msg => msg.media?.[0]?.url && msg.media[0].type === MediaTypeEnum.IMAGE
			)
			.map(msg => ({ src: msg.media[0].url }))

		const videos = messages
			.filter(
				msg => msg.media?.[0]?.url && msg.media[0].type === MediaTypeEnum.VIDEO
			)
			.map(msg => {
				const fileName = msg.media[0].name
				const fileExtension = fileName?.split(".").pop() || ""
				return { src: msg.media[0].url, type: fileExtension }
			})

		const name = chat?.members.find((m: ChatMemberType) => m.userId !== userId)
			?.user.name

		return { allImages: images, allVideos: videos, interlocutorsName: name }
	}, [messages, chat?.members, userId])

	const isFirstMessageOfDay =
		!previousMessage ||
		new Date(message.createdAt).toDateString() !==
			new Date(previousMessage.createdAt).toDateString()

	const onSelectMessage = useCallback(() => {
		const messageId = message.id
		setSelectedMessages(prev => {
			const isMessageSelected = prev.some(item => item.id === messageId)
			return isMessageSelected
				? prev.filter(item => item.id !== messageId)
				: [...prev, message]
		})
	}, [message, setSelectedMessages])

	const onSelectMessageForMainDiv = useCallback(() => {
		if (hasSelectedMessages) {
			onSelectMessage()
		}
	}, [hasSelectedMessages, onSelectMessage])

	return (
		<div
			onClick={onSelectMessageForMainDiv}
			tabIndex={0}
			role="button"
			className="cursor-default"
		>
			{isFirstMessageOfDay && (
				<div className="w-full flex items-center justify-center py-4">
					<Typography
						tag="h6"
						className="bg-black/20 dark:bg-[#1E2C3A] text-white font-[400] px-3 py-0.5 rounded-full text-[14px]"
					>
						{formattedDate}
					</Typography>
				</div>
			)}

			<ContextMenu>
				<MessageTrigger
					message={message}
					nextMessage={nextMessage}
					previousMessage={previousMessage}
					userId={userId}
					hasSelectedMessages={hasSelectedMessages}
					isSameMessage={isSameMessage}
					isFirstMessage={isFirstMessage}
					isLastMessage={isLastMessage}
					allImages={allImages}
					allVideos={allVideos}
					handleScrollToReply={handleScrollToReply}
					highlightedMessageId={highlightedMessageId}
				/>
				<MessageMenu
					isMyMessage={isMyMessage}
					createdDate={createdDate}
					message={message}
					interlocutorsName={interlocutorsName}
					chat={chat}
					onSelectMessage={onSelectMessage}
					handleEditMessage={handleEditMessage}
					onReply={handleReplyMessage}
				/>
			</ContextMenu>
		</div>
	)
}

MessagesComponent.displayName = "Messages"

// Memoize Messages component to prevent unnecessary re-renders
export const Messages = memo(MessagesComponent, (prevProps, nextProps) => {
	// Check if any props that would affect rendering have changed
	return (
		prevProps.message.id === nextProps.message.id &&
		prevProps.message.content === nextProps.message.content &&
		prevProps.message.createdAt === nextProps.message.createdAt &&
		prevProps.message.isPinned === nextProps.message.isPinned &&
		prevProps.message.status === nextProps.message.status &&
		prevProps.message.userId === nextProps.message.userId &&
		prevProps.userId === nextProps.userId &&
		prevProps.index === nextProps.index &&
		prevProps.locale === nextProps.locale &&
		prevProps.hasSelectedMessages === nextProps.hasSelectedMessages &&
		prevProps.selectedMessages.length === nextProps.selectedMessages.length &&
		prevProps.selectedMessages.every(
			(msg, i) => msg.id === nextProps.selectedMessages[i]?.id
		) &&
		prevProps.chat?.id === nextProps.chat?.id &&
		prevProps.chat?.type === nextProps.chat?.type &&
		prevProps.messages.length === nextProps.messages.length &&
		prevProps.message.media?.length === nextProps.message.media?.length &&
		prevProps.message.reactions?.length ===
			nextProps.message.reactions?.length &&
		prevProps.highlightedMessageId === nextProps.highlightedMessageId
	)
})
