import { FoundedChatsType } from "@/prisma/models"
import { Typography } from "@/shared/ui/Typography/Typography"
import { FC } from "react"
import { ICutChat } from "../../shared/types/types.type"
import { IncludedChatItem } from "../../shared/ui/IncludedChatItem"

interface IChatsProps {
	localChats: FoundedChatsType[] | undefined
	onChatRemoveOrAdd: (chat: ICutChat) => void
	includeChatIds: string[]
}

export const Chats: FC<IChatsProps> = ({
	localChats,
	onChatRemoveOrAdd,
	includeChatIds,
}) => {
	return (
		<div className="flex flex-col gap-2">
			<div className="bg-[#202B38] h-[30px] flex items-center pl-4">
				<Typography tag="p" className="text-[14px] text-[#8C98A4]">
					Chats
				</Typography>
			</div>
			<div className="flex flex-col overflow-y-auto h-[350px]">
				{localChats?.map(chat => {
					const onClickHandler = () => onChatRemoveOrAdd(chat)
					const isAdded = includeChatIds.includes(chat.chatId)
					return (
						<IncludedChatItem
							key={chat.chatId}
							chat={chat}
							onClickHandler={onClickHandler}
							isAdded={isAdded}
						/>
					)
				})}
			</div>
		</div>
	)
}
