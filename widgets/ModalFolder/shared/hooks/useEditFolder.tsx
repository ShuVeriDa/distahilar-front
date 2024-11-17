import { ChatType } from "@/prisma/models"
import { useFolderQuery } from "@/shared/lib/services/folder/useFolderQuery"
import { useState } from "react"

export const useEditFolder = (
	folderId: string | undefined,
	onCloseCurrentModal: () => void
) => {
	const [folderNameValue, setFolderNameValue] = useState<string>("")
	const [chatsLocale, setChatsLocale] = useState<ChatType[]>([])
	const [deletedChatIds, setDeletedChatIds] = useState<string[]>([])

	const onAddChatLocale = (chats: ChatType[], folderName: string) => {
		setChatsLocale(chats)
		setFolderNameValue(folderName)
	}

	const { fetchFolderQuery, deleteChatFromFolderQuery, updateFolderQuery } =
		useFolderQuery(folderId, onAddChatLocale)

	const { data: folder, isLoading } = fetchFolderQuery
	const { mutateAsync: removeChat } = deleteChatFromFolderQuery
	const { mutateAsync: editFolder } = updateFolderQuery

	const onChangeFolderName = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFolderNameValue(e.currentTarget.value)
	}

	const onDeleteChatLocale = (id: string) => {
		setChatsLocale(chatsLocale.filter(chat => chat.id !== id))
		setDeletedChatIds([...deletedChatIds, id])
	}

	const onDeleteChat = async () => {
		if (folder && deletedChatIds.length > 0) {
			console.log("delete folder")
			await removeChat({ folderId: folder.id, chatIds: deletedChatIds })
		}
	}

	const onSaveFolder = async () => {
		if (folder?.name !== folderNameValue) {
			await editFolder({ name: folderNameValue })
		}
	}

	const onSave = async () => {
		await onDeleteChat()
		await onSaveFolder()
		onCloseCurrentModal()
	}

	return {
		folderNameValue,
		isLoading,
		chatsLocale,
		onSave,
		onDeleteChatLocale,
		onChangeFolderName,
	}
}
