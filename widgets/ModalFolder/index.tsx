"use client"

import { useModal } from "@/shared/hooks/useModal"
import { FC } from "react"

import { ModalLayout } from "@/shared/layout/ModalLayout"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import { cn } from "@/shared/lib/utils/cn"
import { Typography } from "@/shared/ui/Typography/Typography"
import { Banner } from "./entities/Banner"
import { MyFolders } from "./entities/MyFolders"

interface IModalFolderProps {}

export const ModalFolder: FC<IModalFolderProps> = () => {
	const { onClose, currentModal, isModalOpen } = useModal()
	const { type } = currentModal
	const isCurrentModal = isModalOpen && type === EnumModel.FOLDERS

	const CLASSNAME_UNDERLINE =
		"relative after:absolute after:w-full after:h-[1px] after:left-[0px] after:bottom-0 after:bg-[#E7E7E7] after:dark:bg-[#101921]"

	return (
		<ModalLayout
			isCurrentModal={isCurrentModal}
			onClose={onClose}
			className="p-0"
			isXClose
		>
			<div
				className={cn(
					"flex flex-col gap-4 p-4 border-b-[1px] border-b-[#CECECE]",
					CLASSNAME_UNDERLINE
				)}
			>
				<Typography tag="h4" className="font-normal">
					Folders
				</Typography>
			</div>
			<Banner />
			<MyFolders />
		</ModalLayout>
	)
}
