"use client"

import { useModal } from "@/shared/hooks/useModal"
import { FC } from "react"

import { ModalFooter } from "@/entities/ModalFooter"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import { HeaderFolderManager } from "../../features/HeaderFolderManager"
import { IncludedChatsFolderManager } from "../../features/IncludedChatsFolderManager"
import { useFolderManager } from "../../shared/hooks/useFolderManager"

interface IModalEditFolderProps {}

export const ModalEditFolder: FC<IModalEditFolderProps> = ({}) => {
	console.log("ModalEditFolder")

	const { onCloseCurrentModal, currentModal, onOpenModal, onSetIsFetchModal } =
		useModal()
	const { data } = currentModal
	const folder = data?.folderEdit?.folder
	const isFetching = data?.folderEdit?.isFetching

	const {
		folderNameValue,
		chatsLocale,
		iconValue,
		onDeleteChatLocale,
		onChangeFolderName,
		onSave,
		onChangeIcon,
		onAddChatsIds,
		onRemoveChatsIds,
		onClose,
	} = useFolderManager(
		"edit",
		onCloseCurrentModal,
		onSetIsFetchModal,
		folder,
		isFetching
	)

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
			onClose={onClose}
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
