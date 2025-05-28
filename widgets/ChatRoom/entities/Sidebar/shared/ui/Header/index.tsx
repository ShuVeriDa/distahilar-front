import { ChatType, UserType } from "@/prisma/models"
import { Button, Typography } from "@/shared"
import { useChatInfo } from "@/shared/hooks/useChatInfo"
import { ChatRole } from "@prisma/client"
import Image from "next/image"
import { FC } from "react"
import { IoCloseOutline } from "react-icons/io5"

interface IHeaderProps {
	user: UserType | null
	chat: ChatType | undefined
}

export const Header: FC<IHeaderProps> = ({ chat, user }) => {
	const { onlineOrFollowers, name, interlocutor } = useChatInfo(chat, user)

	const isDialog = chat?.type === ChatRole.DIALOG
	const isGroup = chat?.type === ChatRole.GROUP
	const title = isDialog ? "User Info" : isGroup ? "Group Info" : "Channel Info"
	const image = isDialog
		? interlocutor?.imageUrl ?? "/images/no-avatar.png"
		: chat?.imageUrl ?? "/images/no-avatar.png"

	return (
		<div className="w-full flex flex-col ">
			<div className="w-full flex justify-between items-center h-[57px] pl-5 pr-3.5">
				<Typography tag="p" className="text-[15px] font-normal">
					{title}
				</Typography>
				<Button variant="withoutBg" className="hover:bg-white">
					<IoCloseOutline
						size={25}
						onClick={() => {}}
						className="text-[#737E87] hover:text-[#616a72] hover:dark:text-white "
					/>
				</Button>
			</div>
			<div className="flex gap-5 pl-5 pr-3.5 py-4">
				<div className="w-full h-full max-w-[70px] max-h-[70px] rounded-full">
					<Image
						src={image}
						alt="chat-avatar"
						width={70}
						height={70}
						className="rounded-full"
					/>
				</div>

				<div className="flex flex-col justify-center overflow-hidden">
					<Typography
						tag="p"
						className="text-[15px] font-semibold truncate overflow-hidden whitespace-nowrap max-w-full"
					>
						{name}
					</Typography>
					<Typography
						tag="p"
						className="text-[13px] font-normal text-[#999999]"
					>
						{onlineOrFollowers}
					</Typography>
				</div>
			</div>
		</div>
	)
}
