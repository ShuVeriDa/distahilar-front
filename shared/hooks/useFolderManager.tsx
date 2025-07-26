"use client"

import { ChatType } from "@/prisma/models"
import { IconsRendererType } from "@/shared/ui/IconRenderer/data"
import { mapToCutChat } from "@/widgets/ModalFolderIncludeChats/shared/lib/mapToCutChat"
import { ICutChat } from "@/widgets/ModalFolderIncludeChats/shared/types/types.type"
import { useEffect } from "react"
import {
	useAddChatToFolder,
	useCreateFolder,
	useDeleteChatFromFolder,
	useUpdateFolder,
} from "../lib/services/folder/useFolderQuery"
import { useModal } from "./useModal"

export const useFolderManager = (type: "create" | "edit") => {
	const {
		folderManage,
		currentModal,
		onCloseCurrentModal,
		onOpenModal,
		onSetIsFetchModal,
		onAddedChatsIds,
		onChatsLocale,
		onDeletedChatsIds,
		onFolderNameValue,
		onIconValue,
	} = useModal()

	const {
		addedChatsIds,
		chatsLocale,
		deletedChatIds,
		folderNameValue,
		iconValue,
	} = folderManage!

	const { data } = currentModal
	const folder = data?.folderManage?.folder
	const isFetching = data?.folderManage?.isFetching

	const onAddChatsIds = (chats: ICutChat[], ids: string[]) => {
		const updatedDeletedChatIds = deletedChatIds.filter(
			(id: string) => !ids.includes(id)
		)

		const updatedAddChatIds = Array.from(new Set([...addedChatsIds, ...ids]))

		const updatedChatsLocale = Array.from(new Set([...chatsLocale, ...chats]))

		onChatsLocale(updatedChatsLocale)
		onAddedChatsIds(updatedAddChatIds)
		onDeletedChatsIds(updatedDeletedChatIds)
	}

	const onRemoveChatsIds = (ids: string[]) => {
		const updatedChatsLocale = chatsLocale.filter(
			(chat: ICutChat) => !ids.includes(chat.chatId)
		)

		const updatedDeletedChatIds = Array.from(
			new Set([...deletedChatIds, ...ids])
		)

		const updatedAddedChatIds = addedChatsIds.filter(
			(id: string) => !ids.includes(id)
		)

		onChatsLocale(updatedChatsLocale)
		onAddedChatsIds(updatedAddedChatIds)
		onDeletedChatsIds(updatedDeletedChatIds)
	}

	useEffect(() => {
		if (isFetching && folder && type === "edit") {
			const mutatedChats = folder.chats.map((obj: ChatType) =>
				mapToCutChat(obj as ChatType)
			)
			onChatsLocale(mutatedChats)
			onFolderNameValue(folder?.name)
			onIconValue(folder?.imageUrl as string)
			onSetIsFetchModal(false)
		}
	}, [
		isFetching,
		folder,
		type,
		onChatsLocale,
		onFolderNameValue,
		onIconValue,
		onSetIsFetchModal,
	])

	const { mutateAsync: createFolderMutate } = useCreateFolder()
	const { mutateAsync: removeChatMutate } = useDeleteChatFromFolder()
	const { mutateAsync: addChatsMutate } = useAddChatToFolder()
	const { mutateAsync: editFolderMutate } = useUpdateFolder(folder?.id)

	const onChangeFolderName = (e: React.ChangeEvent<HTMLInputElement>) => {
		onFolderNameValue(e.currentTarget.value)
	}

	const onChangeIcon = (icon: IconsRendererType) => {
		onIconValue(icon)
	}

	const onDeleteChatLocale = (id: string) => {
		onChatsLocale(chatsLocale.filter((chat: ICutChat) => chat.chatId !== id))
		onDeletedChatsIds([...deletedChatIds, id])
	}

	const onAddChats = async () => {
		if (folder && addedChatsIds.length > 0) {
			await addChatsMutate({ folderId: folder.id, chatIds: addedChatsIds })
		}
	}

	const onDeleteChats = async () => {
		if (folder && deletedChatIds.length > 0) {
			await removeChatMutate({ folderId: folder.id, chatIds: deletedChatIds })
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

	const onCreateFolder = async () => {
		await createFolderMutate({
			name: folderNameValue,
			imageUrl: iconValue ? iconValue : "Folder",
			chatIds: addedChatsIds,
		})
	}

	const onReset = () => {
		onAddedChatsIds([])
		onDeletedChatsIds([])
		onChatsLocale([])
		onFolderNameValue("")
		onIconValue("")
	}

	const onClose = () => {
		onCloseCurrentModal(onReset)
	}

	const onSave = async () => {
		if (type === "edit") {
			await onDeleteChats()
			await onAddChats()
			await onEditFolder()
		}

		if (type === "create") onCreateFolder()

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
		onOpenModal,
	}
}
