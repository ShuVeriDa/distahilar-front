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

	console.log({ chatsLocale, deletedChatIds })

	const onRemoveChatsIds = (ids: string[]) => {
		console.log("1 stage", { ids, chatsLocale, deletedChatIds })

		const updatedChatsLocale = chatsLocale.filter(
			chat => !ids.includes(chat.chatId)
		)
		const updatedDeletedChatIds = deletedChatIds.filter(id => !ids.includes(id))

		setChatsLocale(updatedChatsLocale)
		setDeletedChatIds(updatedDeletedChatIds)

		console.log("2 stage", { ids, chatsLocale, deletedChatIds })
	}

	// const onAddChatLocale = (
	// 	chats: ChatType[],
	// 	folderName: string,
	// 	icon: IconsRendererType | string | null
	// ) => {
	// 	setChatsLocale(chats)
	// 	setFolderNameValue(folderName)
	// 	if (icon) setIconValue(icon)
	// }

	const { deleteChatFromFolderQuery, updateFolderQuery } = useFolderQuery(
		folder?.id
		// onAddChatLocale
	)

	// const { data: folder, isLoading } = fetchFolderQuery
	const { mutateAsync: removeChat } = deleteChatFromFolderQuery
	const { mutateAsync: editFolder } = updateFolderQuery

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
		await onDeleteChat()
		await onSaveFolder()
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
