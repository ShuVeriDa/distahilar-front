"use client"

import { ChatRole, MemberRole } from "@/prisma/models"
import { Button } from "@/shared"
import { cn } from "@/shared/lib/utils/cn"

import { FC, useMemo } from "react"
import { BsChatSquareText } from "react-icons/bs"
import { FiSidebar } from "react-icons/fi"
import { IoIosCall, IoIosSearch } from "react-icons/io"

interface IButtonsProps {
	openSideBar: boolean
	memberRole: MemberRole
	chatType: ChatRole
	actionsForButtons: (() => void)[]
}

export const ChatHeaderButtons: FC<IButtonsProps> = ({
	openSideBar,
	actionsForButtons,
	chatType,
	memberRole,
}) => {
	console.log({ memberRole, chatType, is: chatType })
	const btns = useMemo(
		() => [
			{
				component: (
					<Button
						variant="clean"
						key="search"
						onClick={() => {}}
						className="h-full w-[30px] rounded-full hover:cursor-pointer group"
					>
						<IoIosSearch
							color="#999999"
							size={20}
							className="group-hover:[&>path]:fill-[#737373]"
						/>
					</Button>
				),
			},
			{
				component: (
					<Button
						variant="clean"
						key="call"
						onClick={actionsForButtons[1]}
						className={cn(
							"h-full w-[30px] rounded-full hover:cursor-pointer group",
							chatType !== ChatRole.DIALOG && "!hidden"
						)}
					>
						<IoIosCall
							size={22}
							className={cn("text-[#999999] group-hover:text-[#737373] ")}
						/>
					</Button>
				),
			},
			{
				component: (
					<Button
						variant="clean"
						key="live"
						onClick={actionsForButtons[3]}
						className={cn(
							"h-full w-[30px] rounded-full hover:cursor-pointer group",
							(chatType === ChatRole.DIALOG ||
								memberRole === MemberRole.GUEST) &&
								"!hidden"
						)}
					>
						<BsChatSquareText
							size={22}
							className={cn("text-[#999999] group-hover:text-[#737373]")}
						/>
					</Button>
				),
			},
			{
				component: (
					<Button
						variant="clean"
						key="sidebar"
						onClick={actionsForButtons[2]}
						className="h-full w-[30px] rounded-full hover:cursor-pointer group"
					>
						<FiSidebar
							size={22}
							className={cn(
								"text-[#999999] group-hover:text-[#737373] rotate-180",
								openSideBar && "text-[#4FA7D9] group-hover:text-[#3298d8]"
							)}
						/>
					</Button>
				),
			},
		],
		[actionsForButtons, chatType, memberRole, openSideBar]
	)

	return (
		<div className="flex items-center gap-3 h-full">
			{btns.map((btn, index) => {
				if (index === 0) return null
				return btn.component
			})}
		</div>
	)
}
