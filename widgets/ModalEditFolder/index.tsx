"use client"

import { FC } from "react"

import { ModalFooter } from "@/entities/ModalFooter"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import { HeaderFolderManager } from "../../features/HeaderFolderManager"
import { IncludedChatsFolderManager } from "../../features/IncludedChatsFolderManager"
import { useFolderManager } from "../../shared/hooks/useFolderManager"

interface IModalEditFolderProps {}

export const ModalEditFolder: FC<IModalEditFolderProps> = ({}) => {
	const {
		folderNameValue,
		chatsLocale,
		iconValue,
		folder,
		onDeleteChatLocale,
		onChangeFolderName,
		onSave,
		onChangeIcon,
		onAddChatsIds,
		onRemoveChatsIds,
		onClose,
		onOpenModal,
	} = useFolderManager("edit")

	const onOpenIncludeChats = () => {
		if (folder) {
			onOpenModal(EnumModel.INCLUDE_CHATS, {
				includeChats: {
					id: folder.id,
					chats: chatsLocale,
					onAddChatsIds,
					onRemoveChatsIds,
				},
			})
		}
	}

	return (
		<ModalLayout
			onClose={() => {}}
			className="p-0"
			isClickOutside={false}
			translateX={0}
		>
			<HeaderFolderManager
				title="Edit Folder"
				folderName={folderNameValue}
				onChangeFolderName={onChangeFolderName}
				onChangeIcon={onChangeIcon}
				iconUrl={iconValue}
				className="after:hidden before:absolute before:w-full before:h-[1px] before:left-[0px] before:top-12 before:bg-[#E0E0E0] before:dark:bg-[#101921]"
			/>
			<div className="h-2 bg-[#F1F1F1] dark:bg-[#232E3C]" />

			<IncludedChatsFolderManager
				chats={chatsLocale}
				onDeleteLocale={onDeleteChatLocale}
				isLoading={false}
				onOpenIncludeChats={onOpenIncludeChats}
			/>

			<ModalFooter isLoading={false} onClose={onClose} onSave={onSave} />
		</ModalLayout>
	)
}
