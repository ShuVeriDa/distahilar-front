"use client"

import { FC } from "react"
import { SheetComponent } from "../SheetComponent/SheetComponent"
import { Folders } from "./entities/folders"

interface ILeftBarProps {}

export const LeftBar: FC<ILeftBarProps> = () => {
	return (
		<div className="w-[70px] dark:bg-[rgb(0,0,0,0.13)] flex flex-col items-center">
			<SheetComponent />
			<Folders />
		</div>
	)
}
