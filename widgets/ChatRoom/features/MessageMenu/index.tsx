"use client"

import {
	ChatRole,
	MessageEnum,
	MessageStatus,
	MessageType,
} from "@/prisma/models"
import { Typography, useModal } from "@/shared"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import { usePinMessage } from "@/shared/lib/services/message/useMessagesQuery"
import { useAddReaction } from "@/shared/lib/services/message/useReactionQuery"
import { writeClipboardText } from "@/shared/lib/utils/clipboardText"
import { cn } from "@/shared/lib/utils/cn"
import {
	ContextMenuContent,
	ContextMenuItem,
} from "@/shared/ui/ContenxtMenu/context-menu"
import { IsRead, IsReadType } from "@/shared/ui/isRead"
import { EmojiClickData } from "emoji-picker-react"
import dynamic from "next/dynamic"
import { FC, useCallback } from "react"
import { AiOutlineDelete, AiOutlinePushpin } from "react-icons/ai"
import { BsReply } from "react-icons/bs"
import { IoCheckmarkCircleOutline } from "react-icons/io5"
import { PiPencilSimple } from "react-icons/pi"
import { RiUnpinLine } from "react-icons/ri"
import { TbCopy } from "react-icons/tb"
import { TiArrowForwardOutline } from "react-icons/ti"

const Picker = dynamic(
	() => {
		return import("emoji-picker-react")
	},
	{ ssr: false }
)

interface IMessageMenuProps {
	isMyMessage: boolean
	createdDate: string | undefined
	message: MessageType
	interlocutorsName: string | undefined
	onSelectMessage: () => void
	handleEditMessage: (message: MessageType | null) => void
}

export const MessageMenu: FC<IMessageMenuProps> = ({
	createdDate,
	isMyMessage,
	message,
	interlocutorsName,
	onSelectMessage,
	handleEditMessage,
}) => {
	const isCircleVideo = message.messageType === MessageEnum.VIDEO
	const { mutateAsync: pinMessage } = usePinMessage(message.chatId)
	const { mutateAsync: addReaction } = useAddReaction()
	const { onOpenModal } = useModal()

	// Оставляем только действительно нужные useCallback
	const handleEmojiClick = useCallback(
		(emoji: EmojiClickData) => {
			addReaction({
				emoji: emoji.emoji,
				messageId: message.id,
				chatId: message.chatId,
			})
		},
		[addReaction, message.id, message.chatId]
	)

	// Упрощаем обработчики - убираем избыточные useCallback
	const handleEdit = () => {
		if (isMyMessage) {
			handleEditMessage(message)
		}
	}

	const handlePin = () => {
		pinMessage({ messageId: message.id, chatId: message.chatId })
	}

	const handleCopy = () => {
		if (message.content) {
			writeClipboardText(message.content)
		}
	}

	const handleDelete = () => {
		onOpenModal(EnumModel.DELETE_MESSAGES, {
			deleteMessages: {
				messageIds: [message.id],
				chatId: message.chatId,
				interlocutorsName:
					message.chat.type === ChatRole.DIALOG ? interlocutorsName : undefined,
				chatType: message.chat.type as ChatRole,
				clearSelectedMessages: () => {},
			},
		})
	}

	// Упрощаем options - создаем каждый раз заново (быстрая операция)
	const pinIcon = message.isPinned ? (
		<RiUnpinLine size={20} />
	) : (
		<AiOutlinePushpin size={20} />
	)
	const pinTitle = message.isPinned ? "Unpin" : "Pin"

	const options = [
		{
			icon: <BsReply size={20} />,
			title: "Reply",
			function: () => {},
		},
		{
			icon: <PiPencilSimple size={20} />,
			title: "Edit",
			function: handleEdit,
		},
		{
			icon: pinIcon,
			title: pinTitle,
			function: handlePin,
		},
		{
			icon: <TbCopy size={20} />,
			title: "Copy text",
			function: handleCopy,
		},
		{
			icon: <TiArrowForwardOutline size={20} />,
			title: "Forward",
			function: () => {},
		},
		{
			icon: <AiOutlineDelete size={20} />,
			title: "Delete",
			function: handleDelete,
		},
		{
			icon: <IoCheckmarkCircleOutline size={20} />,
			title: "Select",
			function: onSelectMessage,
		},
	]

	const containerClasses = cn(
		"!w-[170px] border bg-white dark:bg-[#17212B] dark:border-[#101921] rounded-sm shadow-md",
		isMyMessage ? "self-end" : "self-start"
	)

	return (
		<ContextMenuContent className="flex flex-col justify-center px-0 gap-2 relative bg-transparent border-none shadow-none">
			<ContextMenuItem
				key="emoji-picker"
				className="focus:bg-white-0 custom-emoji-picker p-0"
			>
				<Picker
					reactionsDefaultOpen={true}
					className="!bg-white dark:!bg-[#17212B] dark:border-[#17212B]"
					lazyLoadEmojis
					onEmojiClick={handleEmojiClick}
				/>
			</ContextMenuItem>

			<div className={containerClasses}>
				<div className="py-1">
					{options.map((option, i) => {
						const shouldHideOption =
							(message.messageType !== MessageEnum.TEXT &&
								(i === 1 || i === 3)) ||
							(!isMyMessage && i === 1)

						if (shouldHideOption) return null

						return (
							<ContextMenuItem
								key={option.title}
								className="flex dark:text-white text-black gap-4 px-4 hover:bg-[rgba(0,0,0,0.1)] hover:dark:bg-[#232E3C] rounded-none"
								onClick={option.function}
							>
								<div>{option.icon}</div>
								<Typography tag="p" className="text-[14px] !font-[400]">
									{option.title}
								</Typography>
							</ContextMenuItem>
						)
					})}
				</div>

				{isMyMessage && (
					<>
						<div className="h-[10px] w-full bg-[#F1F1F1] dark:bg-[#202B38]" />
						<div className="flex px-4 py-2 items-center gap-2">
							<div className="flex">
								<IsRead
									status={message.status as MessageStatus}
									isCircleVideo={isCircleVideo}
									isReadType={IsReadType.MESSAGE_MENU}
								/>
							</div>
							<div>
								<Typography tag="p" className="text-[12px] !font-[400]">
									{createdDate}
								</Typography>
							</div>
						</div>
					</>
				)}
			</div>
		</ContextMenuContent>
	)
}
