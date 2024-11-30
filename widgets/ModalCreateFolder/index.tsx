import { ModalFooter } from "@/entities/ModalFooter"
import { HeaderFolderManager, IncludedChatsFolderManager } from "@/features"
import { useFolderManager } from "@/shared/hooks/useFolderManager"
import { useModal } from "@/shared/hooks/useModal"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"

import { FC } from "react"

interface IModalCreateFolderProps {}

export const ModalCreateFolder: FC<IModalCreateFolderProps> = () => {
	const { onCloseCurrentModal, onOpenModal, onSetIsFetchModal } = useModal()

	const {
		folderNameValue,
		iconValue,
		chatsLocale,

		onDeleteChatLocale,
		onClose,
		onSave,
		onAddChatsIds,
		onRemoveChatsIds,
		onChangeFolderName,
		onChangeIcon,
	} = useFolderManager("create", onCloseCurrentModal, onSetIsFetchModal)

	const onOpenIncludeChats = () => {
		onOpenModal(EnumModel.INCLUDE_CHATS, {
			includeChats: {
				chats: chatsLocale,
				onAddChatsIds,
				onRemoveChatsIds,
			},
		})
	}

	return (
		<ModalLayout
			onClose={onClose}
			className="p-0"
			isClickOutside={false}
			translateX={0}
		>
			<HeaderFolderManager
				title="New Folder"
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
