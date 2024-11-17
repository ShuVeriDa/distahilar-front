import { ChatType } from "@/prisma/models"
import { Button } from "@/shared/ui/Button"
import { Typography } from "@/shared/ui/Typography/Typography"
import { FC } from "react"
import { FaPlus } from "react-icons/fa6"

import { ChatItem } from "../../shared/ui"

interface IIncludedChatsProps {
	chats: ChatType[]
	onDeleteLocale: (id: string) => void
	isLoading: boolean
}

export const IncludedChats: FC<IIncludedChatsProps> = ({
	chats,
	onDeleteLocale,
	isLoading,
}) => {
	return (
		<div className="flex flex-col gap-4  py-4">
			<Typography tag="h5" className="font-bold text-[#51B3F3]">
				Included chats
			</Typography>

			<div className="flex flex-col gap-2 ">
				<Button className="w-full px-4 flex !justify-start items-center gap-1 text-[#51B3F3] text-[15px] dark:hover:bg-[#292d35] hover:bg-[rgba(0,0,0,0.06)]">
					<div className="w-[40px] h-[40px] flex items-center justify-center">
						<div className="flex items-center justify-center w-[22px] h-[22px] rounded-full text-white font-bold bg-[#5288C1]">
							<FaPlus size={14} />
						</div>
					</div>
					<div>Add Chats</div>
				</Button>

				<div className="flex flex-col gap-3 overflow-y-auto min-h-[200px] max-h-[400px] px-4">
					{isLoading ? (
						<>
							<ChatItem.Skeleton />
							<ChatItem.Skeleton />
							<ChatItem.Skeleton />
						</>
					) : (
						chats.map(chat => {
							const onClickHandler = () => onDeleteLocale(chat.id)
							return (
								<ChatItem
									key={chat.id}
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
