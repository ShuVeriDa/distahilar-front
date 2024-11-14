"use client"

import { useModal } from "@/shared/hooks/useModal"
import { FC } from "react"

import { ModalLayout } from "@/shared/layout/ModalLayout"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import { cn } from "@/shared/lib/utils/cn"
import { Field } from "@/shared/ui/Field"
import { Typography } from "@/shared/ui/Typography/Typography"

interface IModalEditFolderProps {}

export const ModalEditFolder: FC<IModalEditFolderProps> = () => {
	const { onClose, currentModal, isModalOpen } = useModal()
	const { type } = currentModal
	const isCurrentModal = isModalOpen && type === EnumModel.EDIT_FOLDER

	const CLASSNAME_UNDERLINE =
		"relative after:absolute after:w-full after:h-[1px] after:left-[0px] after:bottom-0 after:bg-[#E7E7E7] after:dark:bg-[#101921]"

	return (
		<ModalLayout
			isCurrentModal={isCurrentModal}
			onClose={onClose}
			className="p-0"
			isClickOutside={false}
		>
			<div className={cn("flex flex-col gap-3 px-4 py-4", CLASSNAME_UNDERLINE)}>
				<Typography tag="h4" className="font-normal">
					Edit Folder
				</Typography>

				<Field label="Folder name" variant={"primary"} />
			</div>
		</ModalLayout>
	)
}
