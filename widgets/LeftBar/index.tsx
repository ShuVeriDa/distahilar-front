import { FC } from "react"
import { Logout } from "../Logout"
import { SheetComponent } from "../SheetComponent/SheetComponent"
import { Folders } from "./entities/folders"

interface ILeftBarProps {}

export const LeftBar: FC<ILeftBarProps> = () => {
	return (
		<div className="w-[70px] bg-[#293A4C] flex flex-col items-center justify-between">
			<div className="flex flex-col w-full items-center">
				<SheetComponent />
				<Folders />
			</div>

			<Logout />
		</div>
	)
}
