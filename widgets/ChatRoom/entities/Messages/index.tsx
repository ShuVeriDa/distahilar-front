"use client"

import { Typography, useUser } from "@/shared"
import { useScrollToLastMessage } from "@/shared/hooks/useScrollToLastMessage"

import { MessageType } from "@/prisma/models"
import { formatTime } from "@/shared/lib/utils/formatTime"
import { ContextMenu } from "@/shared/ui/ContenxtMenu/context-menu"
import { FC } from "react"

import { MessageMenu } from "../../features/MessageMenu"
import { MessageTrigger } from "../../features/MessageTrigger"

interface IMessagesProps {
	messages: MessageType[]
	locale: string
}

export const Messages: FC<IMessagesProps> = ({ messages, locale }) => {
	const { containerRef } = useScrollToLastMessage(messages)
	const { user } = useUser()
	const userId = user?.id

	return (
		<div
			ref={containerRef}
			className="w-full h-full overflow-y-auto flex flex-1 flex-col  px-5 py-3"
		>
			{messages.map((message, index) => {
				const isMyMessage = message.userId === userId
				const createdDate = formatTime(message.createdAt, "forMessage", locale)
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
					<div key={message.id}>
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

						<ContextMenu>
							<MessageTrigger
								message={message}
								nextMessage={messages[index + 1]}
								userId={userId}
							/>

							<MessageMenu
								isMyMessage={isMyMessage}
								createdDate={createdDate}
								locale={locale}
								message={message}
							/>
						</ContextMenu>
					</div>
				)
			})}
		</div>
	)
}
