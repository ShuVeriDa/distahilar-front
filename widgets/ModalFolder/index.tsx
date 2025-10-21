"use client"

import { useModal } from "@/shared/hooks/useModal"
import { FC } from "react"

import { ModalLayout } from "@/shared/layout/ModalLayout"
import { cn } from "@/shared/lib/utils/cn"
import { Typography } from "@/shared/ui/Typography/Typography"
import { useTranslations } from "next-intl"
import { Banner } from "./entities/Banner"
import { MyFolders } from "./entities/MyFolders"

interface IModalFolderProps {}

export const ModalFolder: FC<IModalFolderProps> = () => {
	const { onClose } = useModal()
	const t = useTranslations("MODALS.FOLDERS")

	const CLASSNAME_UNDERLINE =
		"relative after:absolute after:w-full after:h-[1px] after:left-[0px] after:bottom-0 after:bg-[#E7E7E7] after:dark:bg-[#101921]"

	return (
		<ModalLayout onClose={onClose} className="p-0" isXClose isClickOutside>
			<div
				className={cn(
					"flex flex-col gap-4 p-4 border-b-[1px] border-b-[#CECECE]",
					CLASSNAME_UNDERLINE
				)}
			>
				<Typography tag="h4" className="font-normal">
					{t("TITLE")}
				</Typography>
			</div>
			<Banner />
			<MyFolders />
		</ModalLayout>
	)
}
