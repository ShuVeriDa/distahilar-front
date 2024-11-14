"use client"

import { useModal } from "@/shared/hooks/useModal"
import { FC } from "react"

import { ModalHeaderInfo } from "@/entities/ModalHeaderInfo"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import { cn } from "@/shared/lib/utils/cn"
import { Typography } from "@/shared/ui/Typography/Typography"
import { FaRegCircleUser } from "react-icons/fa6"
import { HiOutlineFolder } from "react-icons/hi"
import { IoLanguage } from "react-icons/io5"
import { IItem, SheetLinks } from "../SheetComponent/entities/Links"

const items: IItem[] = [
	{
		name: "My Account",
		icon: <FaRegCircleUser size={20} />,
		type: EnumModel.ACCOUNT,
	},
	{
		name: "Folders",
		icon: <HiOutlineFolder size={20} />,
		type: EnumModel.FOLDERS,
	},
	{
		name: "Language",
		icon: <IoLanguage size={20} />,
		type: EnumModel.LANGUAGE,
	},
]

interface IModalSettingsProps {}

export const ModalSettings: FC<IModalSettingsProps> = () => {
	const { onClose, currentModal, isModalOpen, popoverRef } = useModal()
	const { type } = currentModal
	const isCurrentModal = isModalOpen && type === EnumModel.SETTINGS

	const CLASSNAME_UNDERLINE =
		"relative after:absolute after:w-full after:h-[1px] after:left-[0px] after:bottom-0 after:bg-[#E7E7E7] after:dark:bg-[#101921]"

	return (
		<ModalLayout
			isCurrentModal={isCurrentModal}
			onClose={onClose}
			className="p-0"
			isXClose
			popoverRef={popoverRef}
			isClickOutside
		>
			<div className={cn("flex flex-col gap-4 px-4 py-4", CLASSNAME_UNDERLINE)}>
				<Typography tag="h4" className="font-normal">
					Settings
				</Typography>

				<ModalHeaderInfo classNameAvatar="w-20 h-20" variant="settings" />
			</div>
			<div className="h-2.5 bg-[#F1F1F1] dark:bg-[#232E3C]" />
			<SheetLinks items={items} variant="settings" ref={popoverRef} />
		</ModalLayout>
	)
}
