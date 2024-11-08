import { useModal } from "@/shared/hooks/useModal"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"

import { FC, ReactNode } from "react"
import { FaRegCircleUser, FaRegMoon } from "react-icons/fa6"
import { IoMegaphoneOutline, IoSettingsOutline } from "react-icons/io5"
import { RiGroupLine } from "react-icons/ri"
import { Link } from "./ui/Link"

interface ISheetLinksProps {
	closeSheet: () => void
}

export type IItem = {
	name: string
	icon: ReactNode
	type: EnumModel
}

const items: IItem[] = [
	{
		name: "New Group",
		icon: <RiGroupLine size={20} className={"group-hover:text-white"} />,
		type: EnumModel.GROUP,
	},
	{
		name: "New Channel",
		icon: <IoMegaphoneOutline size={20} className={"group-hover:text-white"} />,
		type: EnumModel.CHANNEL,
	},
	{
		name: "Contacts",
		icon: <FaRegCircleUser size={20} className={"group-hover:text-white"} />,
		type: EnumModel.CONTACTS,
	},
	{
		name: "Settings",
		icon: <IoSettingsOutline size={20} className={"group-hover:text-white"} />,
		type: EnumModel.SETTINGS,
	},
	{
		name: "Night Mode",
		icon: <FaRegMoon size={20} className={"group-hover:text-white"} />,
		type: EnumModel.NO_TYPE,
	},
]

export const SheetLinks: FC<ISheetLinksProps> = ({ closeSheet }) => {
	const { onOpenModal } = useModal()

	const onClickModal = (type: EnumModel) => {
		if (type === EnumModel.NO_TYPE) return
		onOpenModal(type)
		closeSheet()
	}

	return (
		<div className="p-[5px] flex flex-col">
			{items.map((item, index) => (
				<Link
					key={index}
					item={item}
					onClick={() => onClickModal(item.type)}
					tag={item.type === EnumModel.NO_TYPE ? "div" : "button"}
				/>
			))}
		</div>
	)
}
