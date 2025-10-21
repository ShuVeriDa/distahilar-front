"use client"

import { useModal } from "@/shared/hooks/useModal"
import { FC } from "react"

import { ModalHeaderInfo } from "@/entities/ModalHeaderInfo"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import { cn } from "@/shared/lib/utils/cn"
import { Gap } from "@/shared/ui/Gap"
import { Typography } from "@/shared/ui/Typography/Typography"
import { useTranslations } from "next-intl"
import { FaRegCircleUser } from "react-icons/fa6"
import { HiOutlineFolder } from "react-icons/hi"
import { IoLanguage } from "react-icons/io5"
import { IItem, SheetLinks } from "../SheetComponent/entities/Links"

interface IModalSettingsProps {}

export const ModalSettings: FC<IModalSettingsProps> = () => {
	const { onClose, popoverRef } = useModal()
	const t = useTranslations("MODALS.SETTINGS")

	const items: IItem[] = [
		{
			name: t("MY_ACCOUNT"),
			icon: <FaRegCircleUser size={20} />,
			type: EnumModel.ACCOUNT,
		},
		{
			name: t("FOLDERS"),
			icon: <HiOutlineFolder size={20} />,
			type: EnumModel.FOLDERS,
		},
		{
			name: t("LANGUAGE"),
			icon: <IoLanguage size={20} />,
			type: EnumModel.LANGUAGE,
		},
	]

	const CLASSNAME_UNDERLINE =
		"relative after:absolute after:w-full after:h-[1px] after:left-[0px] after:bottom-0 after:bg-[#E7E7E7] after:dark:bg-[#101921]"

	return (
		<ModalLayout
			onClose={onClose}
			className="p-0"
			isXClose
			popoverRef={popoverRef}
			isClickOutside
		>
			<div className={cn("flex flex-col gap-4 px-4 py-4", CLASSNAME_UNDERLINE)}>
				<Typography tag="h4" className="font-normal">
					{t("TITLE")}
				</Typography>

				<ModalHeaderInfo classNameAvatar="w-20 h-20" variant="settings" />
			</div>
			<Gap />
			<SheetLinks items={items} variant="settings" ref={popoverRef} />
		</ModalLayout>
	)
}
