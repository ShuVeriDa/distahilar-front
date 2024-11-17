"use client"

import { useModal } from "@/shared/hooks/useModal"
import { FC, useState } from "react"

import { ChatType } from "@/prisma/models"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import { useFolderQuery } from "@/shared/lib/services/folder/useFolderQuery"
import { cn } from "@/shared/lib/utils/cn"
import { Button } from "@/shared/ui/Button"
import { Header } from "./entities/Header"
import { IncludedChats } from "./entities/IncludedChats"

interface IModalEditFolderProps {}

export const ModalEditFolder: FC<IModalEditFolderProps> = ({}) => {
	const [chatsLocale, setChatsLocale] = useState<ChatType[]>([])
	const [deletedChatIds, setDeletedChatIds] = useState<string[]>([])

	const onAddChatLocale = (chats: ChatType[]) => {
		setChatsLocale(chats)
	}

	const { onCloseCurrentModal, currentModal, isModalOpen } = useModal()
	const { type, data } = currentModal
	const id = data?.folderEdit.id
	const isCurrentModal = isModalOpen && type === EnumModel.EDIT_FOLDER

	const { fetchFolderQuery, deleteChatFromFolderQuery } = useFolderQuery(
		id,
		onAddChatLocale
	)

	const { data: folder, isLoading } = fetchFolderQuery
	const { mutateAsync } = deleteChatFromFolderQuery

	const CLASSNAME_UPPERDERLINE =
		"relative after:absolute after:w-full after:h-[1px] after:left-[0px] after:top-0 after:bg-[#E7E7E7] after:dark:bg-[#101921]"

	const onDeleteChatLocale = (id: string) => {
		setChatsLocale(chatsLocale.filter(chat => chat.id !== id))
		setDeletedChatIds([...deletedChatIds, id])
	}

	const onDeleteChat = async () => {
		if (folder && deletedChatIds.length > 0) {
			await mutateAsync({ folderId: folder.id, chatIds: deletedChatIds })
		}
	}

	const onSave = async () => {
		await onDeleteChat()
		onCloseCurrentModal()
	}

	return (
		<ModalLayout
			isCurrentModal={isCurrentModal}
			onClose={onCloseCurrentModal}
			className="p-0"
			isClickOutside={false}
			translateX={0}
		>
			<Header folderName={folder?.name} />
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
