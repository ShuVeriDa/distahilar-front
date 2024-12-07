import { ModalHeaderInfo } from "@/entities/ModalHeaderInfo"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/ui/Sheet/sheet"
import { FC, useState } from "react"
import { FaRegCircleUser, FaRegMoon } from "react-icons/fa6"
import { IoMdMenu } from "react-icons/io"
import { IoMegaphoneOutline, IoSettingsOutline } from "react-icons/io5"
import { RiGroupLine } from "react-icons/ri"
import { IItem, SheetLinks } from "./entities/Links"

interface ISheetComponentProps {}

const items: IItem[] = [
	{
		name: "New Group",
		icon: <RiGroupLine size={20} />,
		type: EnumModel.GROUP,
	},
	{
		name: "New Channel",
		icon: <IoMegaphoneOutline size={20} />,
		type: EnumModel.CHANNEL,
	},
	{
		name: "Contacts",
		icon: <FaRegCircleUser size={20} />,
		type: EnumModel.CONTACTS,
	},
	{
		name: "Settings",
		icon: <IoSettingsOutline size={20} />,
		type: EnumModel.SETTINGS,
	},
	{
		name: "Night Mode",
		icon: <FaRegMoon size={20} />,
		type: EnumModel.NO_TYPE,
	},
]

export const SheetComponent: FC<ISheetComponentProps> = () => {
	const [isOpen, setIsOpen] = useState(false)

	const closeSheet = () => setIsOpen(false)
	return (
		<div className="w-12 h-12 flex flex-col justify-center items-center ">
			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetTrigger>
					<IoMdMenu className=" [&>path]:fill-[#8393A3]" size={25} />
				</SheetTrigger>
				<SheetContent className="flex flex-col gap-2 dark:bg-[#17212B]">
					<SheetHeader className="hidden">
						<SheetTitle></SheetTitle>
					</SheetHeader>

					<div className="flex flex-col gap-2 relative p-5 pb-0">
						<ModalHeaderInfo variant="sheet" />
					</div>
					<div className="h-[1px] w-full left-[-24px] dark:bg-[#101921] bg-[#E7E7E7]" />

					<SheetLinks variant="sheet" closeSheet={closeSheet} items={items} />
				</SheetContent>
			</Sheet>
		</div>
	)
}
