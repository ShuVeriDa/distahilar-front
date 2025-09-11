"use client"

import { Button } from "@/shared"
import { cn } from "@/shared/lib/utils/cn"

import { FC, useMemo } from "react"
import { FiSidebar } from "react-icons/fi"
import { IoIosCall, IoIosSearch } from "react-icons/io"
import { MdLiveTv } from "react-icons/md"

interface IButtonsProps {
	openSideBar: boolean
	actionsForButtons: (() => void)[]
}

export const Buttons: FC<IButtonsProps> = ({
	openSideBar,
	actionsForButtons,
}) => {
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
						className="h-full w-[30px] rounded-full hover:cursor-pointer group"
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
						className="h-full w-[30px] rounded-full hover:cursor-pointer group"
					>
						<MdLiveTv
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
		[actionsForButtons, openSideBar]
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
