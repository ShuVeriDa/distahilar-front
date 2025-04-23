import { ChatRole, MessageType } from "@/prisma/models"
import { Button, useModal } from "@/shared"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import { FC } from "react"

interface IHeaderSelectedMessagesProps {
	selectedMessages: MessageType[]
	clearSelectedMessages: () => void
	name: string | undefined
}

export const HeaderSelectedMessages: FC<IHeaderSelectedMessagesProps> = ({
	selectedMessages,
	clearSelectedMessages,
	name,
}) => {
	const length = selectedMessages.length

	const { onOpenModal } = useModal()

	const onOpenHandler = () => {
		onOpenModal(EnumModel.DELETE_MESSAGES, {
			deleteMessages: {
				messageIds: selectedMessages.map(msg => msg.id),
				chatId: selectedMessages[0].chatId,
				interlocutorsName:
					selectedMessages[0].chat.type === ChatRole.DIALOG ? name : undefined,
				chatType: selectedMessages[0].chat.type as ChatRole,
				clearSelectedMessages,
			},
		})
	}

	return (
		<div className="w-full flex h-full justify-between items-center">
			<div className="flex gap-2">
				<Button variant="blue" className="uppercase">
					<span>Forward</span>
					<span>{length}</span>
				</Button>
				<Button variant="blue" className="uppercase" onClick={onOpenHandler}>
					<span>Delete</span>
					<span>{length}</span>
				</Button>
			</div>
			<div>
				<Button
					variant="blue"
					className="bg-white text-[#168ACD] hover:bg-[#40A7E3]/10 uppercase font-medium "
					onClick={clearSelectedMessages}
				>
					Cancel
				</Button>
			</div>
		</div>
	)
}
