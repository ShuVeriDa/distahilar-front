import { FoundedChatsType } from "@/prisma/models"
import { Typography } from "@/shared/ui/Typography/Typography"
import { useTranslations } from "next-intl"
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
	const t = useTranslations("MODALS.FOLDERS.MANAGE_FOLDER")

	return (
		<div className="flex flex-col gap-2">
			<div className="bg-[#F1F1F1] dark:bg-[#202B38] h-[30px] flex items-center pl-4">
				<Typography tag="p" className="text-[14px] text-[#919191]">
					{t("CHATS")}
				</Typography>
			</div>
			<div className="flex flex-col overflow-y-auto telegram-scrollbar h-[350px]">
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
