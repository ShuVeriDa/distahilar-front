"use client"

import { Button } from "@/shared"
import { FC, useMemo } from "react"
import { BsReverseLayoutSidebarReverse } from "react-icons/bs"
import { IoIosSearch, IoMdCall } from "react-icons/io"

interface IButtonsProps {
	actionsForButtons: (() => void)[]
}

export const Buttons: FC<IButtonsProps> = ({ actionsForButtons }) => {
	const btns = useMemo(
		() => [
			{
				icon: (
					<IoIosSearch
						color="#999999"
						size={20}
						className="group-hover:[&>path]:fill-[#737373]"
					/>
				),
				action: () => {},
			},
			{
				icon: (
					<IoMdCall
						color="#999999"
						size={20}
						className="group-hover:[&>path]:fill-[#737373]"
					/>
				),
				action: () => {},
			},

			{
				icon: (
					<BsReverseLayoutSidebarReverse
						color="#999999"
						size={20}
						className="group-hover:[&>path]:fill-[#737373]"
					/>
				),
				action: actionsForButtons[0],
			},
		],
		[actionsForButtons]
	)
	return (
		<div className="flex items-center gap-3 h-full">
			{btns.map((btn, index) => (
				<Button
					variant="clean"
					key={index}
					onClick={btn.action}
					className="h-full w-[30px] rounded-full hover:cursor-pointer group"
				>
					{btn.icon}
				</Button>
			))}
		</div>
	)
}
