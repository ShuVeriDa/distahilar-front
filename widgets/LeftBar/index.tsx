"use client"

import { FC } from "react"
import { SheetComponent } from "../SheetComponent/SheetComponent"
import { Folders } from "./entities/folders"

interface ILeftBarProps {}

export const LeftBar: FC<ILeftBarProps> = () => {
	return (
		<div className="w-[70px] dark:bg-[#0E1621] flex flex-col items-center">
			<SheetComponent />
			<Folders />
		</div>
	)
}
