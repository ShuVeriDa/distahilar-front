"use client"

import { Button } from "@/shared"
import { FC, useMemo } from "react"
import { BsReverseLayoutSidebarReverse } from "react-icons/bs"
import { IoIosSearch, IoMdCall } from "react-icons/io"

interface IButtonsProps {}

export const Buttons: FC<IButtonsProps> = () => {
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
				action: () => {},
			},
		],
		[]
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
