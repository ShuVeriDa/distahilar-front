import { ThemeToggle } from "@/shared/ui/Theme"
import { Typography } from "@/shared/ui/Typography/Typography"
import { FC, ReactNode } from "react"
import { FaRegCircleUser, FaRegMoon } from "react-icons/fa6"
import { IoMegaphoneOutline, IoSettingsOutline } from "react-icons/io5"
import { RiGroupLine } from "react-icons/ri"

interface ISheetLinksProps {}

type TypeItem = "group" | "channel" | "contacts" | "settings" | "theme"

export type IItem = {
	name: string
	icon: ReactNode
	type: TypeItem
}

const items: IItem[] = [
	{
		name: "New Group",
		icon: <RiGroupLine size={20} className={"group-hover:text-white"} />,
		type: "group",
	},
	{
		name: "New Channel",
		icon: <IoMegaphoneOutline size={20} className={"group-hover:text-white"} />,
		type: "channel",
	},
	{
		name: "Contacts",
		icon: <FaRegCircleUser size={20} className={"group-hover:text-white"} />,
		type: "contacts",
	},
	{
		name: "Settings",
		icon: <IoSettingsOutline size={20} className={"group-hover:text-white"} />,
		type: "settings",
	},
	{
		name: "Night Mode",
		icon: <FaRegMoon size={20} className={"group-hover:text-white"} />,
		type: "theme",
	},
]

export const SheetLinks: FC<ISheetLinksProps> = () => {
	return (
		<div className="p-[5px] flex flex-col">
			{items.map(item => (
				<div
					key={item.type}
					className="group flex px-4 h-[34px] rounded-[3px] justify-between items-center cursor-pointer dark:hover:bg-[#292d35] hover:bg-[rgba(0,0,0,0.6)] relative"
				>
					<div className="flex gap-3">
						<div>{item.icon}</div>

						<Typography tag="p" className="text-[14px] group-hover:text-white">
							{item.name}
						</Typography>
					</div>

					<div className="w-[3px] h-[16px] group-hover:bg-[#60cdff] rounded-full absolute left-0" />

					{item.type === "theme" && <ThemeToggle />}
				</div>
			))}
			{/* <SheetClose ref={ref} /> */}
		</div>
	)
}
