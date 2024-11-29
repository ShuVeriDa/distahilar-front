"use client"

import { useModal } from "@/shared/hooks/useModal"
import { FC } from "react"

import { ModalFooter } from "@/entities/ModalFooter"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import { useEditFolder } from "../../ModalFolder/shared/hooks/useEditFolder"
import { Header } from "../features/Header"
import { IncludedChats } from "../features/IncludedChats"

interface IModalEditFolderProps {}

export const ModalEditFolder: FC<IModalEditFolderProps> = ({}) => {
	const {
		onCloseCurrentModal,
		currentModal,
		isModalOpen,
		onOpenModal,
		onSetIsFetchModal,
	} = useModal()
	const { type, data } = currentModal
	const folder = data?.folderEdit?.folder
	const isFetching = data?.folderEdit?.isFetching
	const isCurrentModal = isModalOpen && type === EnumModel.EDIT_FOLDER

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
	} = useEditFolder(folder, isFetching, onCloseCurrentModal, onSetIsFetchModal)

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
			isCurrentModal={isCurrentModal}
			onClose={onClose}
			className="p-0"
			isClickOutside={false}
			translateX={0}
		>
			<Header
				folderName={folderNameValue}
				onChangeFolderName={onChangeFolderName}
				onChangeIcon={onChangeIcon}
				iconUrl={iconValue}
			/>
			<div className="h-2 bg-[#F1F1F1] dark:bg-[#232E3C]" />

			<IncludedChats
				chats={chatsLocale}
				onDeleteLocale={onDeleteChatLocale}
				isLoading={false}
				onOpenIncludeChats={onOpenIncludeChats}
			/>

			<ModalFooter isLoading={false} onClose={onClose} onSave={onSave} />
		</ModalLayout>
	)
}
