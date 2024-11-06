import { useModal } from "@/shared/hooks/useModal"
import { ModelType } from "@/shared/lib/redux-store/slices/model-slice/type"
import { ThemeToggle } from "@/shared/ui/Theme"
import { Typography } from "@/shared/ui/Typography/Typography"
import { FC, ReactNode } from "react"
import { FaRegCircleUser, FaRegMoon } from "react-icons/fa6"
import { IoMegaphoneOutline, IoSettingsOutline } from "react-icons/io5"
import { RiGroupLine } from "react-icons/ri"

interface ISheetLinksProps {
	closeSheet: () => void
}

export type IItem = {
	name: string
	icon: ReactNode
	type: ModelType
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
		type: null,
	},
]

export const SheetLinks: FC<ISheetLinksProps> = ({ closeSheet }) => {
	const { onOpenModal } = useModal()

	const onClickModal = (type: ModelType) => {
		onOpenModal(type)
		closeSheet()
	}

	return (
		<div className="p-[5px] flex flex-col">
			{items.map(item => (
				<button
					key={item.type}
					className="group flex px-4 h-[34px] rounded-[3px] justify-between items-center cursor-pointer dark:hover:bg-[#292d35] hover:bg-[rgba(0,0,0,0.6)] relative"
					onClick={() => onClickModal(item.type)}
				>
					<div className="flex gap-3">
						<div>{item.icon}</div>

						<Typography tag="p" className="text-[14px] group-hover:text-white">
							{item.name}
						</Typography>
					</div>

					<div className="w-[3px] h-[16px] group-hover:bg-[#60cdff] rounded-full absolute left-0" />

					{!item.type && <ThemeToggle />}
				</button>
			))}
		</div>
	)
}
