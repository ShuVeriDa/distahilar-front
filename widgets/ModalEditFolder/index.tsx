"use client"

import { useModal } from "@/shared/hooks/useModal"
import { FC } from "react"

import { ModalLayout } from "@/shared/layout/ModalLayout"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import { cn } from "@/shared/lib/utils/cn"
import { Button } from "@/shared/ui/Button"
import { useEditFolder } from "../ModalFolder/shared/hooks/useEditFolder"
import { Header } from "./entities/Header"
import { IncludedChats } from "./entities/IncludedChats"

interface IModalEditFolderProps {}

export const ModalEditFolder: FC<IModalEditFolderProps> = ({}) => {
	const { onCloseCurrentModal, currentModal, isModalOpen } = useModal()
	const { type, data } = currentModal
	const id = data?.folderEdit.id
	const isCurrentModal = isModalOpen && type === EnumModel.EDIT_FOLDER

	const {
		folderNameValue,
		isLoading,
		chatsLocale,
		onDeleteChatLocale,
		onChangeFolderName,
		onSave,
	} = useEditFolder(id, onCloseCurrentModal)

	const CLASSNAME_UPPERDERLINE =
		"relative after:absolute after:w-full after:h-[1px] after:left-[0px] after:top-0 after:bg-[#E7E7E7] after:dark:bg-[#101921]"

	return (
		<ModalLayout
			isCurrentModal={isCurrentModal}
			onClose={onCloseCurrentModal}
			className="p-0"
			isClickOutside={false}
			translateX={0}
		>
			<Header folderName={folderNameValue} onChange={onChangeFolderName} />
			<div className="h-2 bg-[#F1F1F1] dark:bg-[#232E3C]" />

			<IncludedChats
				chats={chatsLocale}
				onDeleteLocale={onDeleteChatLocale}
				isLoading={isLoading}
			/>

			<div
				className={cn(
					"flex justify-end gap-2 px-3 py-3",
					CLASSNAME_UPPERDERLINE
				)}
			>
				<Button
					variant="withoutBg"
					size="sm"
					type="button"
					onClick={onCloseCurrentModal}
					disabled={isLoading}
				>
					Cancel
				</Button>
				<Button
					variant="withoutBg"
					size="sm"
					type="submit"
					onClick={onSave}
					disabled={isLoading}
				>
					Save
				</Button>
			</div>
		</ModalLayout>
	)
}
