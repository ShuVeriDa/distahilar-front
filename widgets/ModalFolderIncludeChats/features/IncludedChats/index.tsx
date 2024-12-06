import { Button } from "@/shared/ui/Button"
import { Typography } from "@/shared/ui/Typography/Typography"
import Image from "next/image"
import { FC } from "react"
import { IoIosClose } from "react-icons/io"
import { ICutChat } from "../../shared/types/types.type"

interface IIncludedChatsProps {
	chats: ICutChat[]
	removeChat: (chatId: string) => void
}

export const IncludedChats: FC<IIncludedChatsProps> = ({
	chats,
	removeChat,
}) => {
	return (
		<div className="p-2 flex flex-wrap gap-3 h-[100px] overflow-y-auto">
			{chats?.map(chat => {
				const onClickHandler = () => removeChat(chat.chatId)
				return (
					<div
						key={chat.chatId}
						className="group flex items-center h-[32px] gap-2 bg-[#F1F1F1] dark:bg-[#1F2C39] rounded-r-full rounded-l-full"
					>
						<Button
							className="w-[32px] h-[32px] rounded-full relative"
							onClick={onClickHandler}
						>
							<div className="absolute inset-0 bg-[#5daef9] transition duration-200 opacity-0 hover:opacity-100 rounded-full flex items-center justify-center scale-90 group-hover:scale-110">
								<IoIosClose
									size={32}
									className="rotate-45 group-hover:rotate-0 duration-300 text-[#ffffff]"
								/>
							</div>

							<Image
								src={chat.imageUrl || "/images/no-avatar.png"}
								alt={"avatar"}
								width={32}
								height={32}
								className="rounded-full"
							/>
						</Button>
						<div className="overflow-hidden max-w-[80px] h-full pr-2 flex items-center">
							<Typography
								tag="p"
								className="text-[12px] font-[400] truncate overflow-hidden whitespace-nowrap"
							>
								{chat.name}
							</Typography>
						</div>
					</div>
				)
			})}
		</div>
	)
}
