import { Typography, useUser } from "@/shared"
import { useScrollToLastMessage } from "@/shared/hooks/useScrollToLastMessage"

import { MessageType } from "@/prisma/models"
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
} from "@/shared/ui/ContenxtMenu/context-menu"
import { FC, useMemo } from "react"
import { AiOutlinePushpin } from "react-icons/ai"
import { BsReply } from "react-icons/bs"
import { IoCheckmarkCircleOutline } from "react-icons/io5"
import { PiPencilSimple } from "react-icons/pi"
import { TbCopy } from "react-icons/tb"
import { TiArrowForwardOutline } from "react-icons/ti"

import { AiOutlineDelete } from "react-icons/ai"

import { formatTime } from "@/shared/lib/utils/formatTime"
import { MessageTrigger } from "../../features/MessageTrigger"

interface IMessagesProps {
	messages: MessageType[]
	locale: string
}

export const Messages: FC<IMessagesProps> = ({ messages, locale }) => {
	const { containerRef } = useScrollToLastMessage(messages)
	const { user } = useUser()

	const userId = user?.id

	const options = useMemo(
		() => [
			{
				icon: <BsReply size={20} />,
				title: "Reply",
			},
			{
				icon: <PiPencilSimple size={20} />,
				title: "Edit",
			},
			{
				icon: <AiOutlinePushpin size={20} />,
				title: "Pin",
			},
			{
				icon: <TbCopy size={20} />,
				title: "Copy text",
			},
			{
				icon: <TiArrowForwardOutline size={20} />,
				title: "Forward",
			},
			{
				icon: <AiOutlineDelete size={20} />,
				title: "Delete",
			},
			{
				icon: <IoCheckmarkCircleOutline size={20} />,
				title: "Select",
			},
		],
		[locale]
	)

	return (
		<div
			ref={containerRef}
			className="w-full h-full overflow-y-auto flex flex-1 flex-col  px-5 py-3"
		>
			{messages.map((message, index) => {
				const previousMessage = messages[index - 1]
				const isFirstMessageOfDay =
					!previousMessage ||
					new Date(message.createdAt).toDateString() !==
						new Date(previousMessage.createdAt).toDateString()

				const formattedDate = formatTime(
					message.createdAt,
					"Month number",
					locale
				)

				return (
					<>
						{isFirstMessageOfDay && (
							<div className="w-full flex items-center justify-center ">
								<Typography
									tag="h6"
									className="bg-black/20 text-white font-[400] px-3 py-0.5 rounded-full text-[14px]"
								>
									{formattedDate}
								</Typography>
							</div>
						)}

						<ContextMenu key={message.id}>
							<MessageTrigger
								message={message}
								nextMessage={messages[index + 1]}
								userId={userId}
							/>
							<ContextMenuContent className="flex flex-col justify-center px-0 !w-[170px]">
								{options.map(option => (
									<ContextMenuItem
										key={option.title}
										className="flex text-black gap-4 px-4"
									>
										<div>{option.icon}</div>
										<Typography tag="p" className="text-[14px] !font-[400]">
											{option.title}
										</Typography>
									</ContextMenuItem>
								))}
							</ContextMenuContent>
						</ContextMenu>
					</>
				)
			})}
		</div>
	)
}
