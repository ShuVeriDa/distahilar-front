"use client"

import { ChatRole, MessageType } from "@/prisma/models"
import { Typography, useModal } from "@/shared"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import { usePinMessage } from "@/shared/lib/services/message/useMessagesQuery"
import { writeClipboardText } from "@/shared/lib/utils/clipboardText"
import { cn } from "@/shared/lib/utils/cn"
import {
	ContextMenuContent,
	ContextMenuItem,
} from "@/shared/ui/ContenxtMenu/context-menu"
import dynamic from "next/dynamic"
import { FC, useMemo } from "react"
import { AiOutlineDelete, AiOutlinePushpin } from "react-icons/ai"
import { BsReply } from "react-icons/bs"
import { IoCheckmarkCircleOutline } from "react-icons/io5"
import { LuCheckCheck } from "react-icons/lu"
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
	locale: string
	message: MessageType
	interlocutorsName: string | undefined
	onSelectMessage: () => void
}

export const MessageMenu: FC<IMessageMenuProps> = ({
	createdDate,
	isMyMessage,
	locale,
	message,
	interlocutorsName,
	onSelectMessage,
}) => {
	const { mutateAsync: pinMessage } = usePinMessage(message.chatId)
	const { onOpenModal } = useModal()

	const options = useMemo(
		() => [
			{
				icon: <BsReply size={20} />,
				title: "Reply",
				function: () => {},
			},
			{
				icon: <PiPencilSimple size={20} />,
				title: "Edit",
				function: () => {},
			},
			{
				icon: message.isPinned ? (
					<RiUnpinLine size={20} />
				) : (
					<AiOutlinePushpin size={20} />
				),
				title: message.isPinned ? "Unpin" : "Pin",
				function: () =>
					pinMessage({ messageId: message.id, chatId: message.chatId }),
			},
			{
				icon: <TbCopy size={20} />,
				title: "Copy text",
				function: () => {
					if (message.content) writeClipboardText(message.content)
				},
			},
			{
				icon: <TiArrowForwardOutline size={20} />,
				title: "Forward",
				function: () => {},
			},
			{
				icon: <AiOutlineDelete size={20} />,
				title: "Delete",
				function: () => {
					onOpenModal(EnumModel.DELETE_MESSAGES, {
						deleteMessages: {
							messageIds: [message.id],
							chatId: message.chatId,
							interlocutorsName:
								message.chat.type === ChatRole.DIALOG
									? interlocutorsName
									: undefined,
							chatType: message.chat.type as ChatRole,
							clearSelectedMessages: () => {},
						},
					})
				},
			},
			{
				icon: <IoCheckmarkCircleOutline size={20} />,
				title: "Select",
				function: () => onSelectMessage(),
			},
		],
		[locale, message.isPinned, message.chatId, message.id, message.content]
	)

	return (
		<ContextMenuContent className="flex flex-col justify-center px-0 gap-4 relative bg-transparent border-none shadow-none">
			<Picker reactionsDefaultOpen={true} className="!bg-white " />

			<div
				className={cn(
					"!w-[170px] border bg-white rounded-sm shadow-md ",
					isMyMessage ? "self-end" : "self-start"
				)}
			>
				<div className="py-1">
					{options.map(option => {
						return (
							<ContextMenuItem
								key={option.title}
								className="flex text-black gap-4 px-4 hover:bg-[rgba(0,0,0,0.1)] hover:dark:bg-[#232E3C] rounded-none"
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

				<div className="h-[10px] w-full bg-[#F1F1F1]" />
				<div className="flex px-4 py-2 items-center gap-2">
					<div>
						<Typography tag="p" className="text-[12px] !font-[400]">
							{createdDate}
						</Typography>
					</div>
					<LuCheckCheck color={"black"} size={14} />
				</div>
			</div>
		</ContextMenuContent>
	)
}
