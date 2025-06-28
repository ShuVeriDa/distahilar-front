import { Typography } from "@/shared"
import { Dispatch, FC, SetStateAction } from "react"

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
}

export const Messages: FC<IMessagesProps> = ({
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
}) => {
	const isSameMessage = selectedMessages.some(item => item.id === message.id)

	const interlocutorsName = chat?.members.find(
		(m: ChatMemberType) => m.userId !== userId
	)?.user.name

	const isMyMessage = message.userId === userId
	const createdDate = formatTime(message.createdAt, "forMessage", locale)
	const previousMessage = messages[index - 1]
	const nextMessage = messages[index + 1]
	const isFirstMessage = index === 0
	const isLastMessage = index === messages.length - 1
	const isFirstMessageOfDay =
		!previousMessage ||
		new Date(message.createdAt).toDateString() !==
			new Date(previousMessage.createdAt).toDateString()

	const formattedDate = formatTime(message.createdAt, "Month number", locale)
	const allImages = messages
		.filter(
			msg =>
				msg.media &&
				msg.media[0]?.url &&
				msg.media[0].type === MediaTypeEnum.IMAGE
		)
		.map(msg => {
			return { src: msg.media[0].url }
		})

	const allVideos = messages
		.filter(
			msg =>
				msg.media &&
				msg.media[0]?.url &&
				msg.media[0].type === MediaTypeEnum.VIDEO
		)
		.map(msg => {
			const fileName = msg.media[0].name
			const fileExtension = fileName?.split(".").pop() || ""

			return { src: msg.media[0].url, type: fileExtension }
		})

	const onSelectMessage = () => {
		setSelectedMessages(prev => {
			const isMessageSelected = prev.some(item => item.id === message.id)

			if (!isMessageSelected) return [...prev, message]
			else return prev.filter(item => item.id !== message.id)
		})
	}

	const onSelectMessageForMainDiv = () => {
		if (!hasSelectedMessages) return
		onSelectMessage()
	}

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
				/>
				<MessageMenu
					isMyMessage={isMyMessage}
					createdDate={createdDate}
					message={message}
					interlocutorsName={interlocutorsName}
					onSelectMessage={onSelectMessage}
					handleEditMessage={handleEditMessage}
				/>
			</ContextMenu>
		</div>
	)
}
