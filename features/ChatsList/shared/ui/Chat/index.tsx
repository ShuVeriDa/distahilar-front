import { FoundedChatsType } from "@/prisma/models"
import { Skeleton, Typography, useUser } from "@/shared"
import { cn } from "@/shared/lib/utils/cn"
import { formatDateTelegramStyle } from "@/shared/lib/utils/formatDateTelegramStyle"
import { ChatRole } from "@prisma/client"
import { useTheme } from "next-themes"
import Image from "next/image"
import { LuCheck, LuCheckCheck } from "react-icons/lu"

interface IChatProps {
	chat: FoundedChatsType
}

export const Chat = ({ chat }: IChatProps) => {
	const { theme } = useTheme()
	const { user } = useUser()
	const date = formatDateTelegramStyle(chat.lastMessageDate)

	const isMyMessage = chat.lastMessage?.userId === user?.id

	const lengthUnread =
		typeof chat.lengthUnread === "number" && chat.lengthUnread! > 0
			? chat.lengthUnread
			: null

	const lastMessage =
		chat.type !== ChatRole.GROUP ? (
			<Typography
				tag="p"
				className={cn(
					"text-[13px] text-[#6D7883] truncate overflow-hidden whitespace-nowrap max-w-full"
				)}
			>
				{chat.lastMessage?.content}
			</Typography>
		) : (
			<Typography
				tag="p"
				className={cn(
					"text-[13px] text-[#6D7883] truncate overflow-hidden whitespace-nowrap max-w-full",
					!chat.lastMessage && "hidden"
				)}
			>
				<span className="text-[#168ACD]">
					{chat.lastMessage?.user?.name}: &nbsp;
				</span>
				<span className="text-[#6D7883]">{chat.lastMessage?.content}</span>
			</Typography>
		)

	return (
		<div className="w-full flex items-center gap-2 px-3 py-2 flex-nowrap hover:cursor-pointer hover:bg-[rgba(0,0,0,0.1)] hover:dark:bg-[#232E3C]">
			<div
				className={"flex w-full h-full"}
				style={{
					maxWidth: `45px`,
					maxHeight: `45px`,
				}}
			>
				<Image
					src={chat?.imageUrl ?? "/images/no-avatar.png"}
					alt={`${chat.name}`}
					className={cn(
						"w-full h-full rounded-xl object-cover",
						chat.type === ChatRole.DIALOG && "rounded-full"
					)}
					width={45}
					height={45}
					loading="lazy"
				/>
			</div>
			<div className="w-[calc(100%-53px)] h-[43px] flex flex-col gap-1 ">
				<div className="flex justify-between">
					<div className="flex overflow-hidden">
						<Typography
							tag="p"
							className={cn(
								"text-[13px] truncate overflow-hidden whitespace-nowrap !font-[600] max-w-full"
							)}
						>
							{chat.name}
						</Typography>
					</div>

					<div className="flex items-center gap-0.5">
						{chat.type === ChatRole.DIALOG && isMyMessage && (
							<div>
								{chat.lastMessage?.isRead ? (
									<LuCheckCheck
										color={theme === "light" ? "#5DC452" : "#71BBFC"}
									/>
								) : (
									<LuCheck color={theme === "light" ? "#5DC452" : "#71BBFC"} />
								)}
							</div>
						)}

						<Typography
							tag="p"
							className={cn("text-[13px] max-w-full text-[#6D7883]")}
						>
							{date}
						</Typography>
					</div>
				</div>
				<div className="w-full flex gap-1">
					<div className="flex overflow-hidden w-full">{lastMessage}</div>
					<div
						className={cn(
							"bg-[#BBBBBB] dark:bg-[#3E546A] text-white h-[22px] min-w-[22px] text-[12px] px-[7px] flex justify-center items-center rounded-full",
							!lengthUnread && "hidden"
						)}
					>
						{lengthUnread}
					</div>
				</div>
			</div>
		</div>
	)
}

Chat.Skeleton = function MyChats() {
	return (
		<div className="w-full h-[61px] flex items-center gap-2 px-3 py-2 flex-nowrap hover:cursor-pointer ">
			<Skeleton className="max-h-[45px] max-w-[45px] w-full h-full rounded-full bg-[#F1F1F1] dark:bg-[#202B38]" />
			<div className="w-full  flex flex-col gap-2 ">
				<Skeleton className="h-[14px] w-[70px] rounded-full bg-[#F1F1F1] dark:bg-[#202B38]" />
				<Skeleton className="h-[14px] w-[110px] rounded-full bg-[#F1F1F1] dark:bg-[#202B38]" />
			</div>
		</div>
	)
}
