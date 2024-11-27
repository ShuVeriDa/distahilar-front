import { ChatType, FolderType } from "@/prisma/models"
import { useFolderQuery } from "@/shared/lib/services/folder/useFolderQuery"
import { IconsRendererType } from "@/shared/ui/IconRenderer/data"
import { mapToCutChat } from "@/widgets/ModalFolderIncludeChats/shared/lib/mapToCutChat"
import { ICutChat } from "@/widgets/ModalFolderIncludeChats/shared/types/types.type"
import { useEffect, useState } from "react"

export const useEditFolder = (
	folder: FolderType | undefined,
	isFetching: boolean | undefined,
	onCloseCurrentModal: (onFunc?: () => void) => void,
	onSetIsFetchModal: (value: boolean) => void
) => {
	const [folderNameValue, setFolderNameValue] = useState<string>("")
	const [iconValue, setIconValue] = useState<string>("")
	const [chatsLocale, setChatsLocale] = useState<ICutChat[]>([])
	const [addedChatsIds, setAddedChatsIds] = useState<string[]>([])
	const [deletedChatIds, setDeletedChatIds] = useState<string[]>([])

	const onAddChatsIds = (chats: ICutChat[], ids: string[]) => {
		setChatsLocale(chats)
		setAddedChatsIds([...addedChatsIds, ...ids])
	}

	useEffect(() => {
		if (isFetching && folder) {
			const mutatedChats = folder.chats.map(obj =>
				mapToCutChat(obj as ChatType)
			)
			setChatsLocale(mutatedChats)
			setFolderNameValue(folder?.name)
			setIconValue(folder?.imageUrl as string)
			onSetIsFetchModal(false)
		}
	}, [isFetching, folder])

	const onRemoveChatsIds = (ids: string[]) => {
		const updatedChatsLocale = chatsLocale.filter(
			chat => !ids.includes(chat.chatId)
		)
		const updatedDeletedChatIds = new Set([...deletedChatIds, ...ids])

		setChatsLocale(updatedChatsLocale)
		setDeletedChatIds(Array.from(updatedDeletedChatIds))
	}

	const { deleteChatFromFolderQuery, updateFolderQuery, addChatToFolderQuery } =
		useFolderQuery(folder?.id)

	const { mutateAsync: removeChatMutate } = deleteChatFromFolderQuery
	const { mutateAsync: addChatsMutate } = addChatToFolderQuery
	const { mutateAsync: editFolderMutate } = updateFolderQuery

	const onChangeFolderName = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFolderNameValue(e.currentTarget.value)
	}

	const onChangeIcon = (icon: IconsRendererType) => {
		setIconValue(icon)
	}

	const onDeleteChatLocale = (id: string) => {
		setChatsLocale(chatsLocale.filter(chat => chat.chatId !== id))
		setDeletedChatIds([...deletedChatIds, id])
	}

	const onDeleteChats = async () => {
		if (folder && deletedChatIds.length > 0) {
			await removeChatMutate({ folderId: folder.id, chatIds: deletedChatIds })
		}
	}

	const onAddChats = async () => {
		if (folder && addedChatsIds.length > 0) {
			await addChatsMutate({ folderId: folder.id, chatIds: addedChatsIds })
		}
	}

	const onEditFolder = async () => {
		if (folder?.name !== folderNameValue || iconValue !== folder.imageUrl) {
			await editFolderMutate({
				name: folderNameValue !== folder?.name ? folderNameValue : undefined,
				imageUrl: iconValue !== folder?.imageUrl ? iconValue : undefined,
			})
		}
	}

	const onReset = () => {
		setAddedChatsIds([])
		setDeletedChatIds([])
		setChatsLocale([])
		setFolderNameValue("")
		setIconValue("")
	}

	const onClose = () => {
		onCloseCurrentModal(onReset)
	}

	const onSave = async () => {
		await onDeleteChats()
		await onAddChats()
		await onEditFolder()
		onCloseCurrentModal(onReset)
	}

	return {
		folder,
		folderNameValue,
		chatsLocale,
		iconValue,
		onSave,
		onDeleteChatLocale,
		onChangeFolderName,
		onChangeIcon,
		onAddChatsIds,
		onRemoveChatsIds,
		onClose,
	}
}
