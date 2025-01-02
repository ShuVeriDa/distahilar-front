import { useUser } from "@/shared"
import { useScrollToLastMessage } from "@/shared/hooks/useScrollToLastMessage"

import { MessageType } from "@/prisma/models"
import { FC } from "react"
import { Message } from "../../features/Message"

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
			className="w-full h-full overflow-y-auto flex flex-col gap-3 px-5 py-3"
		>
			{messages.map((message, index) => {
				return (
					<Message
						key={message.id}
						message={message}
						previousMessage={messages[index - 1]}
						userId={userId}
						locale={locale}
					/>
				)
			})}
		</div>
	)
}
