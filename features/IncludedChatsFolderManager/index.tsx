import { Button } from "@/shared/ui/Button"
import { Typography } from "@/shared/ui/Typography/Typography"
import { FC } from "react"
import { FaPlus } from "react-icons/fa6"

import { ICutChat } from "@/widgets/ModalFolderIncludeChats/shared/types/types.type"
import { useTranslations } from "next-intl"
import { ChatItem } from "./shared/ui/ChatItem"

interface IIncludedChatsFolderManagerProps {
	chats: ICutChat[]
	isLoading: boolean
	onDeleteLocale: (id: string) => void
	onOpenIncludeChats: () => void
}

export const IncludedChatsFolderManager: FC<
	IIncludedChatsFolderManagerProps
> = ({ chats, isLoading, onDeleteLocale, onOpenIncludeChats }) => {
	const t = useTranslations("MODALS.FOLDERS.MANAGE_FOLDER")

	return (
		<div className="flex flex-col gap-4  py-4">
			<Typography
				tag="h5"
				className="font-[500] text-[#168ADE] px-4 !text-[16px]"
			>
				{t("INCLUDED_CHATS")}
			</Typography>

			<div className="flex flex-col gap-2 ">
				<Button
					className="w-full px-4 flex !justify-start items-center gap-1 text-[#51B3F3] text-[15px] dark:hover:bg-[#292d35] hover:bg-[rgba(0,0,0,0.06)]"
					onClick={onOpenIncludeChats}
				>
					<div className="w-[40px] h-[40px] flex items-center justify-center">
						<div className="flex items-center justify-center w-[22px] h-[22px] rounded-full text-white font-bold bg-[#40A7E3]">
							<FaPlus size={14} />
						</div>
					</div>
					<Typography tag="span" className="font-normal">
						{t("ADD_CHATS")}
					</Typography>
				</Button>

				<div className="flex flex-col gap-3 overflow-y-auto telegram-scrollbar min-h-[200px] max-h-[400px] px-4">
					{isLoading ? (
						<>
							<ChatItem.Skeleton />
							<ChatItem.Skeleton />
							<ChatItem.Skeleton />
						</>
					) : (
						chats.map(chat => {
							const onClickHandler = () => onDeleteLocale(chat.chatId)
							return (
								<ChatItem
									key={chat.chatId}
									{...chat}
									onDeleteChat={onClickHandler}
								/>
							)
						})
					)}
				</div>
			</div>
		</div>
	)
}
