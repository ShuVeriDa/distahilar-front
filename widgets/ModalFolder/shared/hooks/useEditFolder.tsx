import { ChatType } from "@/prisma/models"
import { useFolderQuery } from "@/shared/lib/services/folder/useFolderQuery"
import { IconsRendererType } from "@/shared/ui/IconRenderer/data"
import { useState } from "react"

export const useEditFolder = (
	folderId: string | undefined,
	onCloseCurrentModal: () => void
) => {
	const [folderNameValue, setFolderNameValue] = useState<string>("")
	const [iconValue, setIconValue] = useState<string>("")
	const [chatsLocale, setChatsLocale] = useState<ChatType[]>([])
	const [deletedChatIds, setDeletedChatIds] = useState<string[]>([])

	const onAddChatLocale = (
		chats: ChatType[],
		folderName: string,
		icon: IconsRendererType | string
	) => {
		setChatsLocale(chats)
		setFolderNameValue(folderName)
		setIconValue(icon)
	}

	const { fetchFolderQuery, deleteChatFromFolderQuery, updateFolderQuery } =
		useFolderQuery(folderId, onAddChatLocale)

	const { data: folder, isLoading } = fetchFolderQuery
	const { mutateAsync: removeChat } = deleteChatFromFolderQuery
	const { mutateAsync: editFolder } = updateFolderQuery

	const onChangeFolderName = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFolderNameValue(e.currentTarget.value)
	}

	const onChangeIcon = (icon: IconsRendererType) => {
		setIconValue(icon)
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
		if (folder?.name !== folderNameValue || iconValue !== folder.imageUrl) {
			await editFolder({
				name: folderNameValue !== folder?.name ? folderNameValue : undefined,
				imageUrl: iconValue !== folder?.imageUrl ? iconValue : undefined,
			})
		}
	}

	const onSave = async () => {
		await onDeleteChat()
		await onSaveFolder()
		onCloseCurrentModal()
	}

	return {
		folder,
		folderNameValue,
		isLoading,
		chatsLocale,
		iconValue,
		onSave,
		onDeleteChatLocale,
		onChangeFolderName,
		onChangeIcon,
	}
}
